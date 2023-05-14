$(function () {
  let layer = layui.layer;
  let form = layui.form;

  initArtCateList();

  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res)
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  let indexAdd = null;
  // 为添加类别绑定点击事件
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      title: "添加文章分类",
      area: ["500px", "250px"],
      content: $("#dialog-add").html(), //这里content是一个普通的String
    });
  });

  // 为添加类别绑定提交事件 需要用到代理
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg("添加文章类别失败");

        // 渲染
        initArtCateList();
        layer.msg("新增分类成功");
        layer.close(indexAdd);
      },
    });
  });

  //   为编辑按钮绑定点击事件
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      title: "修改文章分类",
      area: ["500px", "250px"],
      content: $("#dialog-edit").html(), //这里content是一个普通的String
    });
    let id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  //   为编辑表单绑定提交事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg("编辑类别失败");
        layer.msg("编辑成功");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  // 为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    let id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg("删除失败");

          layer.msg("删除成功");
          layer.close(index);
          initArtCateList()
        },
      });
    });
  });

});
