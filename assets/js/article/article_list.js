$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;

  // 定义美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义查询对象参数q
  let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };

  initTable();
  initCate();
  // 定义渲染表格函数
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) return layer.msg("获取文章列表失败");
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 调用渲染分页方法
        renderPage(res.total);
      },
    });
  }

  // 定义渲染分类函数
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败");
        }

        let htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr);
        // 通知layui重新渲染
        form.render();
      },
    });
  }

  // 为筛选按钮绑定提交事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();

    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();

    q.cate_id = cate_id;
    q.state = state;

    // 调用渲染表格函数
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      // 自定义排版。
      // 可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      //   每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        // 当分页被切换时触发，函数返回两个参数：
        // obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
        //  console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        //  console.log(obj.limit); //得到每页显示的条数
        // 调整每页显示数目也会触发jump函数
        q.pagesize = obj.limit;
        q.pagenum = obj.curr;
        // 根据最新的q来渲染 直接调用会造成死循环
        // 触发jump回调方式有两种 1.点击 2.触发form.render();函数
        // 可以对first进行判断
        // 如果触发的是第二种方法 那first的值是true
        if (!first) {
          initTable();
        }
      },
    });
  }

  //   为删除按钮绑定代理点击事件
  $("tbody").on("click", ".btn-delete", function () {
    let id = $(this).attr("data-id");
    let len = $(".btn-delete").length;
    console.log(len)
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg("删除文章失败");
          layer.msg("删除文章成功");
          //   当文章删除完后 需要判断在这个页码中还有没有文章
          // 如果没有 需要让页码数-1 再调用initTable函数
          if (len === 1) {
            // 如果len = 1 则删除成功后页面没有其他文章
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });


  // 为编辑按钮绑定代理点击事件
  $('body').on('click','#btn-change',function(e){
    // console.log('1');
    let id  = $(this).attr('data-id')
    $.ajax({
      method:'GET',
      url:'/my/article/' + id,
      success:function(res){
        console.log(res.data)
        localStorage.setItem('id',JSON.stringify(res.data.Id))
        location.href = './article_pub.html'
        // $('[name=content]').val(res.data.content)
      }
    })

  })
});
