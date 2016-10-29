(function($) {
	$.fn.njTree = function(data, callback) {
		this.each(function() {
			var _this = $(this);
			var treedata = data;
			var treelist, treeselect;
			var interferenodes;
			var selectList = [] ;

			var init = function(){
				treelist = $('<div id="treelist"></div>');
				treeselect = $('<ul id="treeselect"></ul>');
				treeselect.on('click', '.remove', function(event) {
					event.preventDefault();
					selectList = [];
					interferenodes = traversal($(this).attr('data-id'), false);
					resetTree();
				});
				var html = getChildHtml();
				treelist.html(html);
				_this.append(treelist);
				_this.append(treeselect);
			}
			
			
			var getChildHtml = function(branchdata){
				var data = branchdata ? branchdata : this.treedata;
				var html = "<ul>";
				for(var i = 0 ; i < data.length ; i ++ ){
					var e = data[i];
					if(typeof(interferenodes) != 'undefined' && e.id == interferenodes.id ){
						treedata[i] = interferenodes;
						e = interferenodes;
					}
					var jsondata = JSON.stringify(e.jsondata);
					var checked = "";
					if(e.checked){
						checked = 'checked';
					}
					var item = '<li data-id="' + e.id + '" data-pid="' + e.pid + '" data-json="' + jsondata + '" class="' + checked + '">' +e.id  + '.' + e.text ;
					if(e.nodes){
						item += getChildHtml(e.nodes);
					}else{
						if(e.checked){
							selectList.push(e);
						}
					}
					item += '</li>';
					html += item;
				}
				html += "</ul>";
				return html;
			}
			
			var setChildStatus = function(nodes, checkStatus){
				for(var i = 0 ; i < nodes.length ; i ++){
					nodes[i].checked = checkStatus;
					if(nodes[i].nodes){
						setChildStatus(nodes[i].nodes, checkStatus);
					}
				}
			}
			var traversal = function(id, checkStatus, nodes){
				var data;
				nodes ? data = nodes : (data = treedata);
				for(var i = 0 ; i < data.length; i ++){
					var item = data[i];
					if(item.id == id){
						item.checked = checkStatus;
						if(item.nodes){
							setChildStatus(item.nodes, checkStatus);
						}
						return item;
					}else{
						if(item.nodes){
							var rs = traversal(id, checkStatus, item.nodes);
							if(typeof(rs) != 'undefined'){
								var ischecked = false;
								for(var j = 0; j < item.nodes.length ; j ++){
									var subitem =  item.nodes[j];
									if(subitem.checked){
										ischecked = true;
									}
								}
								item.checked = ischecked;
								return item;
							}
						}
					}
				}
			}
			var setTreeselect = function(){
				treeselect.html('');
				var html = "";
				for(var i = 0 ; i < selectList.length ; i ++ ){
					var jsondata = JSON.stringify(selectList[i].jsondata);
					var item = '<li><input type="hidden" name="tree[]" value="' + jsondata + '"/><p>' + selectList[i].text + '</p><a class="remove" data-id="' + selectList[i].id + '">×</a></li>';
					html += item;
				}
				treeselect.html(html);
			}

			var resetTree = function(){
				var html = getChildHtml();
				treelist.html(html);
				setTreeselect();
			}
			_this.on('click' , 'li', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var _thisli = $(this);
				var thislichecked = false;
				if(_thisli.hasClass('checked')){
					thislichecked = false;
				}else{
					thislichecked = true;
				}
				selectList = [];
				interferenodes = traversal(_thisli.attr('data-id'), thislichecked);
				resetTree();
			});

			init();
		});
	}
})(jQuery);