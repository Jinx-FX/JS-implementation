# 大文件上传

> 纯逻辑实现，仅包含文件选择和分片上传核心功能
> 
> [大文件上传](https://github.com/Jinx-FX/JS-implementation/blob/main/src/apply/fileUpload.js)

## 核心逻辑说明

这个简化版本包含大文件上传的核心功能，主要逻辑流程如下：

1. **文件选择处理**：通过`handleFileSelect`函数接收文件列表，初始化上传状态
2. **MD5计算**：使用`calculateFileMd5`生成文件唯一标识，用于断点续传和文件合并
3. **文件分片**：`splitFileIntoChunks`将大文件分割为1MB的分片
4. **状态检查**：`checkFileStatus`与服务器交互，判断是否有已上传分片
5. **并发上传**：`uploadAllChunks`控制分片并发上传，默认同时上传3个分片
6. **分片合并**：所有分片上传完成后，通过`mergeChunks`通知服务器合并文件
7. **暂停/恢复**：提供`pauseUpload`和`resumeUpload`控制上传过程

## 使用方法

1. 需要引入SparkMD5库处理文件哈希计算
2. 在HTML中添加文件输入控件并绑定事件：
   ```html
   <input type="file" id="fileInput" />
   <script>
     document.getElementById('fileInput').addEventListener('change', (e) => {
       handleFileSelect(e.target.files);
     });
   </script>
   ```
3. 根据实际后端API地址修改`config.api`中的接口路径
4. 替换模拟上传的代码为真实的API调用

该实现专注于逻辑处理，去除了所有UI相关代码，可根据需要集成到任何前端框架中。