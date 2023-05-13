$(function () {
  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 之间 !";
      }
    },
  });

  // 获取用户基本信息
  initUserinfo();

  function initUserinfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        console.log(res);
        // 为表单赋值
        // form.val
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 重置表单数据
  $("#btnReset").on("click", function (e) {
    // 阻止表单默认提交事件
    e.preventDefault();
    // 调用获取用户信息函数
    initUserinfo();
  });

  //   表单提交
  $(".layui-form").on("submit", function(e){
    // console.log("111");
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data:$(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败");
        }
        layer.msg("更新用户信息成功");
        // 调用index.js的渲染函数
        window.parent.getUserInfo();
      },
    });
  });
});
