$(function () {
  // 获取用户基本信息
  getUserInfo();
  let layer = layui.layer;

  // 实现点击退出按钮跳转页面功能
  $("#btnLogout").on("click", function () {
    // console.log('rr');
    // 提示用户
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        localStorage.removeItem("token");
        location.href = "./login.html";
        layer.close(index);
      }
    );
  });
});
// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers:{
    //     Authorization:localStorage.getItem('token') || ''
    // },
    success: function (res) {
      // console.log(res)
      // 渲染用户头像
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      renderAvatar(res.data);
    },
  });
}

function renderAvatar(user) {
  // 获取用户的名称
  let name = user.nickname || user.username;
  // 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 获取用户头像
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
