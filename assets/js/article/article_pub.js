$(function () {
  let layer = layui.layer;
  let form = layui.form;

  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败");
        }
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //   为选择封面按钮 绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  // 监听文件选择框的change事件
  $("#coverFile").on("change", function (e) {
    // 获取文件列表
    let files = e.target.files;
    // 判断用户是否选中文件
    if (files.length === 0) return;
    // 根据文件创建图片地址
    let newImgURL = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义文章发布状态
  let art_state = "已发布";

  // 为存在草稿绑定点击事件
  $("#save2").on("click", function () {
    art_state = "草稿";
  });

  // 为 表单提交发布事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 基于form表单 快速创建一个FormData对象
    let fd = new FormData($(this)[0]);

    fd.append("state", art_state);

    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
      });
  });

  //   实现发布文章功能

  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 如果表单提交的是FormData数据
      // 必须添加一下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layer.msg("发布文章失败");
        layer.msg("发布文章成功 ");
        location.href = "./article_list.html";
      },
    });
  }

  // 文章编辑功能
  articleChange();

  function articleChange() {
    let id = JSON.parse(localStorage.getItem("id"));
    console.log(id);
    $.ajax({
      method: "GET",
      url: "/my/article/" + id,
      success: function (res) {
        // $.ajax({
        //   method:'POST',
        //   url:'/my/article/edit',
        //   data:{
        //     Id:res.data.Id,
        //     title:res.data.title,
        //     cate_id:res.data.cate_id,
        //     content:res.data.content,
        //     cover_img:res.data.cover_img,
        //     state:res.data.state
        //   },
        //   contentType:false,
        //   processData:false,
        //   function(res){
        //     console.log(res)
        //   }
        // })
        // console.log(res)
        console.log(res)
        form.val("form-pub", res.data);
        // $('#cate_id').html(res.data.cate_id)
      },
    });
  }
});
