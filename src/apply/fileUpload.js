/**
 * 大文件上传核心逻辑实现
 * 功能：文件选择、分片上传、MD5计算、并发控制、合并文件
 */

// 配置参数
/**
 * 配置参数
 *
 * 后端API：
 * 1. check-file：检查文件是否已上传或部分上传
 * 2. upload-chunk：接收分片并保存
 * 3. merge-file：所有分片上传完成后合并为完整文件
 */
const config = {
  chunkSize: 1024 * 1024, // 1MB 分片大小
  concurrent: 3, // 并发上传数量
  api: {
    check: '/api/check',
    uploadChunk: '/api/upload-chunk',
    merge: '/api/merge',
  },
};

// 上传状态管理
let uploadState = {
  file: null,
  fileMd5: '',
  chunks: [],
  totalChunks: 0,
  uploadedChunks: new Set(),
  isPaused: false,
  isUploading: false,
};

/**
 * 处理文件选择
 * @param {FileList} files - 从input获取的文件列表
 */
function handleFileSelect(files) {
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file) return;

  // 重置上传状态
  resetState();
  uploadState.file = file;

  console.log(`选中文件: ${file.name}, 大小: ${formatSize(file.size)}`);
  console.log('请点击上传按钮开始上传');
}

// 手动启动上传（供用户主动调用）
function manualStartUpload() {
  if (!uploadState.file) {
    console.log('请先选择文件');
    return;
  }
  startUploadProcess(); // 启动上传流程
}

/**
 * 开始上传流程
 */
async function startUploadProcess() {
  try {
    // 1. 计算文件MD5
    uploadState.fileMd5 = await calculateFileMd5(uploadState.file);
    console.log(`文件MD5: ${uploadState.fileMd5}`);

    // 2. 分割文件为分片
    splitFileIntoChunks();
    console.log(`文件分割完成，共 ${uploadState.totalChunks} 个分片`);

    // 3. 检查文件状态（是否已上传部分分片）
    const checkResult = await checkFileStatus();
    if (checkResult.isComplete) {
      console.log('文件已完全上传');
      return;
    }

    // 4. 记录已上传的分片
    if (checkResult.uploadedChunks && checkResult.uploadedChunks.length) {
      checkResult.uploadedChunks.forEach((index) => {
        uploadState.uploadedChunks.add(index);
      });
      console.log(`发现 ${uploadState.uploadedChunks.size} 个已上传分片`);
    }

    // 5. 开始上传分片
    uploadState.isUploading = true;
    await uploadAllChunks();

    // 6. 合并分片
    await mergeChunks();
    console.log('文件上传完成');
  } catch (error) {
    console.error('上传失败:', error.message);
  }
}

/**
 * 计算文件MD5
 * @param {File} file - 要计算的文件
 * @returns {Promise<string>} 文件的MD5哈希值
 */
function calculateFileMd5(file) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const chunkSize = 2 * 1024 * 1024; // 2MB 一块
    let offset = 0;

    fileReader.onload = function (e) {
      spark.append(e.target.result);
      offset += chunkSize;

      if (offset < file.size) {
        readNextChunk();
      } else {
        resolve(spark.end());
      }
    };

    fileReader.onerror = function () {
      reject(new Error('MD5计算失败'));
    };

    function readNextChunk() {
      const chunk = file.slice(offset, offset + chunkSize);
      fileReader.readAsArrayBuffer(chunk);
    }

    readNextChunk();
  });
}

/**
 * 将文件分割为分片
 */
function splitFileIntoChunks() {
  const file = uploadState.file;
  const chunkSize = config.chunkSize;
  const totalChunks = Math.ceil(file.size / chunkSize);

  uploadState.totalChunks = totalChunks;
  uploadState.chunks = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    uploadState.chunks.push({
      index: i,
      start,
      end,
      size: end - start,
    });
  }
}

/**
 * 检查文件上传状态
 * @returns {Promise<Object>} 包含是否完成和已上传分片的信息
 */
async function checkFileStatus() {
  // 实际项目中替换为真实API调用
  return new Promise((resolve) => {
    // 模拟后端检查
    setTimeout(() => {
      resolve({
        isComplete: false,
        uploadedChunks: [], // 已上传的分片索引数组
      });
    }, 500);
  });
}

/**
 * 上传所有分片
 */
async function uploadAllChunks() {
  return new Promise((resolve, reject) => {
    const chunks = uploadState.chunks;
    const total = chunks.length;
    let completed = 0;
    let active = 0;
    let index = 0;

    // 上传单个分片
    async function uploadChunk(chunk) {
      if (uploadState.isPaused) return;
      if (uploadState.uploadedChunks.has(chunk.index)) {
        handleChunkComplete();
        return;
      }

      try {
        // 创建FormData
        const formData = new FormData();
        const fileChunk = uploadState.file.slice(chunk.start, chunk.end);

        formData.append('fileMd5', uploadState.fileMd5);
        formData.append('index', chunk.index);
        formData.append('total', total);
        formData.append('chunk', fileChunk);
        formData.append('fileName', uploadState.file.name);

        // 实际项目中替换为真实API调用
        await new Promise((resolve) => {
          // 模拟上传延迟
          setTimeout(() => {
            resolve();
          }, 500 + Math.random() * 1000);
        });

        // 标记为已上传
        uploadState.uploadedChunks.add(chunk.index);
        handleChunkComplete();
      } catch (error) {
        console.error(`分片 ${chunk.index} 上传失败:`, error);
        // 重试上传
        setTimeout(() => uploadChunk(chunk), 1000);
      }
    }

    // 处理分片上传完成
    function handleChunkComplete() {
      completed++;
      active--;

      console.log(
        `上传进度: ${completed}/${total} (${Math.floor(
          (completed / total) * 100
        )}%)`
      );

      // 所有分片上传完成
      if (completed >= total) {
        resolve();
        return;
      }

      // 继续上传下一个分片
      uploadNext();
    }

    // 上传下一个分片
    function uploadNext() {
      if (uploadState.isPaused) return;

      while (active < config.concurrent && index < total) {
        uploadChunk(chunks[index]);
        active++;
        index++;
      }
    }

    // 开始上传
    uploadNext();
  });
}

/**
 * 合并分片
 */
async function mergeChunks() {
  // 实际项目中替换为真实API调用
  return new Promise((resolve, reject) => {
    console.log('开始合并分片...');

    // 模拟合并过程
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

/**
 * 暂停上传
 */
function pauseUpload() {
  if (uploadState.isUploading) {
    uploadState.isPaused = true;
    uploadState.isUploading = false;
    console.log('上传已暂停');
  }
}

/**
 * 恢复上传
 */
async function resumeUpload() {
  if (uploadState.isPaused) {
    uploadState.isPaused = false;
    uploadState.isUploading = true;
    console.log('恢复上传');
    await uploadAllChunks();
    await mergeChunks();
    console.log('文件上传完成');
  }
}

/**
 * 重置上传状态
 */
function resetState() {
  uploadState = {
    file: null,
    fileMd5: '',
    chunks: [],
    totalChunks: 0,
    uploadedChunks: new Set(),
    isPaused: false,
    isUploading: false,
  };
}

/**
 * 格式化文件大小显示
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export { handleFileSelect, manualStartUpload, pauseUpload, resumeUpload };

// 使用示例:
// 1. 在HTML中添加文件输入
// <input type="file" id="fileInput" />
//
// 2. 绑定文件选择事件
// document.getElementById('fileInput').addEventListener('change', (e) => {
//   handleFileSelect(e.target.files);
// });
