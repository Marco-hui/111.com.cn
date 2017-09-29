define(['jquery'],function($){
	return {
		yanzhengma:function(num){
			if(num === undefined){
				num = 4;
			}
			var arr = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
			// ѭ����ȡ��֤��
			var res = '';
			for(var i=0;i<num;i++){
				var idx = parseInt(Math.random()*arr.length);
				res += arr[idx];
			}
			return res;
		},
		randomNumber:function (min,max){
			var res = parseInt(Math.random()*(max-min+1)) + min;
			return res
		},
		randomColor:function(){
			var str = '0123456789abcdef';

			var res = '#';
			for(var i=0;i<6;i++){
				var idx = Math.floor(Math.random()*str.length);
				res += str[idx];
			}
			return res;
		},
		getElement:function(nodes){
			var res = [];
			for(var i=0;i<nodes.length;i++){
				if(nodes[i].nodeType === 1){
					res.push(nodes[i]);
				}
			}
			return res;
		},
		nextElement:function(ele){
			var res = ele.nextSibling;
			// �ж�res�Ƿ�ΪԪ�ؽڵ㣬���Ҳ������һ��Ԫ��
			while(res.nodeType !== 1 && res != ele.parentNode.lastChild){
				res = res.nextSibling;
			}
			return res;
		},
		previousElement:function(ele){
			var res = ele.previousSibling;
			// �ж�res�Ƿ�ΪԪ�ؽڵ㣬���Ҳ������һ��Ԫ��
			while(res.nodeType !== 1 && res != ele.parentNode.firstChild){
				res = res.previousSibling;
			}
			return res;
		},
		getElementsByClassName:function(className){
			if(document.getElementsByClassName){
				return document.getElementsByClassName(className);
			}else{
				var res = [];
				var eles = document.getElementsByTagName('*');

				for(var i=0;i<eles.length;i++){
					if(eles[i].className.indexOf(className)>=0){
						res.push(eles[i]);
					}
				}
				return res;
			}
		},
		getStyle:function(ele,attr){
			var res = '';
			// ��׼�����
			if(window.getComputedStyle){
				res = getComputedStyle(ele)[attr];
			}

			// ie8-
			else if(ele.currentStyle){
				res = ele.currentStyle[attr];
			}

			// ���������
			else{
				res = ele.style[attr];
			}

			return res;
		},
		bind:function(ele,type,handler,capture){
			// ��׼�����
			if(ele.addEventListener){
				ele.addEventListener(type,handler,capture);
			}

			// ie8-
			else if(ele.attachEvent){
				ele.attachEvent('on'+type,handler)
			}

			// ���������
			else{
				ele['on' + type] = handler;
			}
		},
		Cookie:{
			/**
			 * [��ȡcookie]
			 * @param  {String} name [cookie��]
			 * @return {String}      [cookie����Ӧ��ֵ]
			 */
			get:function(name){
				console.log(666);

				var res = '';
				var cookies = document.cookie;
				if(cookies.length>0){
					cookies = cookies.split('; ');
					cookies.forEach(function(cookie){
						var temp = cookie.split('=');
						if(temp[0] === name){
							res = temp[1];
						}
					})
				}
				return res;
			},

			/**
			 * [����cookie]
			 * @param {String} name  [cookie��]
			 * @param {String} value [cookieֵ]
			 * @param {[Object]} opt   [cookie������expires,path,domain]
			 */
			set:function(name,value,opt){
				var cookieStr = name + '=' + value;
				if(opt !== undefined){
					for(var attr in opt){
						cookieStr += ';'+attr + '=' + opt[attr]
					}
				}

				document.cookie = cookieStr;
			},

			// ɾ��cookie
			remove:function(name){
				var date = new Date();
				date.setDate(date.getDate()-10);
				// document.cookie = name + '=x;expires=' + date.toUTCString();
				this.set(name,'x',{expires:date.toUTCString()});
			}
		},
		animate:function(ele,opt,callback){
			// ��¼��������
			let timerLen = 0;

			// ����opt
			for(var attr in opt){
				// ��ΰ�attr�޶����ֲ���������
				// ES6�����������let����attr
				// ��ͳ������������ú�������

				createTimer(attr);

				timerLen++;
			}

			function createTimer(attr){
				// Ϊÿ���������ò�ͬ�Ķ�ʱ��(�ؼ�1)
				let timerName = attr + 'timer';
				let target = opt[attr];

				clearInterval(ele[timerName]);

				// �Ѷ�ʱ����Dom�������ؼ�2��
				ele[timerName] = setInterval(()=>{
					// �Ȼ�ȡ��ǰֵ
					let current = getComputedStyle(ele)[attr];//String:100px,50rem,0.5,60deg

					// ��ȡ��ֵ����λ
					// ���ݵ�ǰֵ��ȡ��λ(��λ��current�����)
					let unit = current.match(/[a-z]+$/);
					if(unit){
						current = current.substring(0,unit.index)*1;
						unit = unit[0]
					}else{
						unit = '';
						current *= 1;
					}

					// �����ٶ�
					let speed = (target - current)/10;

					// ����speedֵ����ֹspeedΪС������ɶ�ʱ���޷���ɵ����
					// 0.3=>1,-0.3=>-1
					speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);


					if(attr === 'opacity'){
						speed = speed>0 ? 0.05 : -0.05;
					}

					// �������
					if(current === target){
						clearInterval(ele[timerName]);
						current = target - speed;

						timerLen--;

						if(typeof callback === 'function' && timerLen === 0){
							callback();
						}
					}

					ele.style[attr] = current + speed + unit;
				},30)
			}
		},
		ajax:function(options){
			// Ĭ��ֵ
			var defaults = {
				type:'get',//post,put,delete,jsonp...
				async:true,
				callbackName:'callback'
			}

			// ��չĬ�ϲ���
			// var opt = Object.assign(defaults,options);
			for(var attr in options){
				defaults[attr] = options[attr];
			}
			var opt = defaults;
			opt.type = opt.type.toLowerCase();


			// �������
			// data:{pageNo:1,qty:10} => 'pageNo=1&qty=10'
			if(opt.data){
				var params = '';
				for(var attr in opt.data){
					params += attr + '=' + opt.data[attr] + '&'
				}

				// ȥ�������&
				params = params.slice(0,-1);
			}

			// �����������Ͷ���url
			if(opt.type === 'get' || opt.type === 'jsonp'){
				var fuhao = opt.url.indexOf('?')>=0 ? '&' : '?';

				opt.url += fuhao + params;


				// opt.url += '?' + params;//../api/football.php?name=laoxie?pageNo=1&qty=10
				params = null;
			}


			// /api/jsonp.php?name=laoxie&pageNo=1&qty=10&callback
			// ��ͬʱ������jsonp����ʱ
			if(opt.type === 'jsonp'){
				// var fnName = 'getData' + parseInt(Math.random()*10000000);
				var fnName = 'getData' + new Date().getTime();

				// 1.Ԥ��ȫ�ֺ���
				window[fnName] = function(data){
					// ��������
					if(typeof opt.success === 'function'){
						opt.success(data);
					}

					// ɾ��script�ڵ�
					script.parentNode.removeChild(script);

					// ɾ��ȫ�ֺ���
					delete window[fnName];
				}

				// 2.����script��ǩ,��д��ҳ��
				var script = document.createElement('script');
				script.src = opt.url + '&'+opt.callbackName + '='+fnName;
				document.head.appendChild(script);


				return;
			}



			// ajax����
			var xhr;

			// ����xhr�첽�������
			try{
				xhr = new XMLHttpRequest();
			}catch(error){
				try{
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				}catch(err){
					try{
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}catch(e){
						alert('��������̫Low�ˣ��Ͻ������ȸ������');
					}
					
				}
			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)){
					var res;
					try{
						res = JSON.parse(xhr.responseText);
					}catch(err){
						res = xhr.responseText;
					}

					if(typeof opt.success === 'function'){

						opt.success(res);
					}
				}
			}
			xhr.open(opt.type,opt.url,opt.async);

			// ���post���󣬱����趨����ͷ
			if(opt.type != 'get'){
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			}
			xhr.send(params);
		},
		type:function(data){
			return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
		}
	}
});