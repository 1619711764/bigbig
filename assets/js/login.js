(function () {
  // 点击“去注册账号”的链接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  // 点击“去登录”的链接
  $("#link_log").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });
  // 从layui获取form对象
  let form = layui.form;
  // 从layui获取layer对象
  let layer = layui.layer;
  // 通过form.verift()函数自定义校验规则
  form.verify({
    // 自定义了一个叫pass的规则
    pass: [/^[\S]{6,12}$/, "密码必须6-12位 且不能出现空格"],
    // 校验两次密码是否一致
    repass: function (value) {
      // 拿到input里面的值 如果判断失败 return一个失败消息
      let pwd = document.querySelector(".reg-box .repwd").value;
      if (pwd !== value) return "两次密码不一致";
    },
  });

  // 监听注册表单提交事件
  $("#form_reg").on("submit", function (e) {
    // 阻止表单提交事件
    e.preventDefault();
    let data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    // 提交post请求
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功");
      // 模拟鼠标点击事件
      $("#link_log").click();
    });
  });

  // 监听登录表单提交事件
  $("#form_log").on("submit", function (e) {
    // 阻止表单默认提交事件
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      url: "/api/login",
      method: "POST",
      // 快速获取表单的内容
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("登录成功");
        // 将登录后服务端返回的token值 储存到localStorage中
        localStorage.setItem("token", res.token);
        // 跳转到后台主页
        location.href = "./index.html";
      },
    });
  });
})();
