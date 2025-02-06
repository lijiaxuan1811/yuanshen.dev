$(document).ready(function () {
    $.ajax({
        url: '/YuanRetro/articles/',
        method: 'GET',
        success: function(data){
            // 将返回的 HTML 数据包装成 jQuery 对象
            // 注意：直接将 data 传入 $() 可能有兼容问题，故先构建一个临时容器
            var $tempDiv = $('<div>').html(data);

            // 从返回的 HTML 中查找 <pre> 标签内的所有 <a> 标签
            $tempDiv.find('pre a').each(function(){
                var href = $(this).attr('href');
                // 过滤掉父目录链接（例如 "../"），只保留 Markdown 文件
                if(href && href !== '../' && href.toLowerCase().endsWith('.md')){
                    // 可选：解码 URL，如果需要的话可以使用 decodeURIComponent(href)
                    var fileName = $(this).text();
                    // 构造完整的链接地址
                    var fileUrl = '/YuanRetro/articles/' + href;
                    // 将链接添加到页面中
                    $('#md-list').append('<li><a href="' + fileUrl + '">' + fileName + '</a></li>');
                }
            });
        },
        error: function(xhr, status, error){
            console.error('加载目录列表失败：', error);
        }
    });
})