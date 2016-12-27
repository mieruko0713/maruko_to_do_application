;(function(){
    'use strict';
    
    //alert(1);
    var $form_add_task = $(".add-task")
       ,$delete_task
       ,new_task = {}
       ,task_list = {};

    init();

    $form_add_task.on("submit",on_add_task_form_submit);
    
    // 提交时添加
    function on_add_task_form_submit(e) {
      // 禁用默认行为
      e.preventDefault();
      // 获取新task的值
      new_task.content = $(this).find('input[name=content]').val();
      // 如果新task值为空 直接返回 否则继续执行
      if(!new_task.content) return;
      if(add_task(new_task)) {
        render_task_list();
      }
      // 存入新task
      console.log("new_task",new_task);
    }

    // 初始化
    function init() {
      task_list = store.get("task_list") || [];
      render_task_list();
    }

    // 添加任务
    function add_task(new_task) {
    	task_list.push(new_task);
    	//  更新localStorage
    	refresh_task_list();
    	return true;
    }
    
    // 刷新localStorage并更新view
    function refresh_task_list() {
      store.set("task_list", task_list);
      render_task_list();
    }
    
    // 删除任务
    function delete_task(index) {
      // 如果没有index或者index不存在
      if(index === undefined || !task_list[index]) return; 

      delete task_list[index];

      // 更新localStorage
      refresh_task_list();
    }
    
    // 渲染全部模版
    function render_task_list() {
    	var $task_list = $(".task-list");
    	$task_list.html("");
    	for(var i = 0; i < task_list.length; i++) {
    		var $task = render_task_tpl(task_list[i], i);
        $task_list.append($task);
    	}
      $delete_task = $(".action.delete");
      $delete_task.on("click", function(){
        var $this = $(this);
        var $item = $this.parent().parent();
        var tmp = confirm("确定删除?"); 
        tmp ? delete_task($item.data("index")) : null;
      });
    }
    
    // 生成模版
    function render_task_tpl(data, index) {
      if( !data || !index) return;
    	var list_item_tpl = 
      '<div class="task-item" data-index="' + index +
      '"><span><input type="checkbox"></span>' +
      '<span class="task-content">' + data.content + '</span>' + 
      '<span class="fr">' + 
          '<span class="action delete">删除</span> ' + 
          '<span class="action">详细</span>' + 
      '</span>' +
      '</div>';

      return $(list_item_tpl);
    }
})();