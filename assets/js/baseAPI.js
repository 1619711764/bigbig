// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url

  // 在发起请求头之前 为每个/my设置请求头
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  }

  // 挂载全局complete对象
  // 无论结果 都会complete回调
  options.complete = function(res){
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
      // 强制清空token
      localStorage.removeItem('token')
      // 跳转
      location.href = './login.html'
    }
  
  }

})

