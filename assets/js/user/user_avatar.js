$(function() {
    var layer = layui.layer
  
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
    }
  
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定事件
    $('#btnChooseImage').on('click',function(){
      $('#file').click()
    })

    //  为file绑定change事件
    $('#file').on('change',function(e){
      let fileList = e.target.files
      if(fileList.length === 0){
        return layer.msg('请选择照片')
      }

      // 拿到用户选择的文件
      let file = e.target.files[0]
      // 将文件转化为路径
      let imgUrl = URL.createObjectURL(file)

      $image.cropper('destroy') //销毁旧照片
      .attr('src',imgUrl)
      .cropper(options)
    })


    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click',function(){
      var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2. 调用接口，把头像上传到服务器

    // 发送ajax请求
    $.ajax({
      method:'POST',
      url:'/my/update/avatar',
      data:{
        avatar:dataURL
      },
      success:function(res){
        if(res.status !== 0){
          return layer.msg('更换头像失败')
        }
        layer.msg('更换头像成功')

        //调用渲染用户信息函数
        window.parent.getUserInfo()
      }
    })
    })
})