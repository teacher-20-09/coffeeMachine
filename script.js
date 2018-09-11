window.onload=function(){
	//клас машина(базовий клас для наслідування)
	function Machine(power){
		//power-потужність машини (приватна властивість)
		var power=power||100;
		//getPower-геттер для приватної властивості power
		this.getPower=function(){
			return power;
		}
		//enable-індикатор(включена/виключена) (приватна властивість)
		var enable=false;
		//getEnable-геттер для приватної властивості enable
		this.getEnable=function(){
			return enable;
		}
		//enabled-включає пристрій (публічний метод)
		this.enabled=function(){
			enable=true;
			console.log(enable);
		}
		//disabled-виключає пристрій (публічний метод)
		this.disabled=function(){
			enable=false;
			console.log(enable);
		}
	}
	//клас кавоварка(функція-конструктор)
	function CoffeeMachine(power){
		//Наслідуєм базовий клас Machine
		//Machine.call(this);
		Machine.apply(this,arguments)
		//parentEnabled -батьківський метод enabled
		var parentEnabled=this.enabled;
		//enabled-включає пристрій (розширюєм батьківський метод enabled)
		this.enabled=function(){
			parentEnabled();
			alert('Кавоварка включена!');
		}
		//power-потужність кавоварки (приватна властивість)
		//var power=power||100;
		//water-кількість води в кавоварці (публічна властивість)
		//this.water=0;
		var water=0;
		//getsetWater-єдиний геттер/сеттер приватної властивості water
		this.getsetWater=function(count){
			//якщо нема аргументів - повернути значення властивості
			if(!arguments.length) return water;
			//якщо процес приготування кави запущений - не заливати воду
			if(ontimer){
				alert('Дочекайтесь приготування кави або зупиніть процес!');
				return;
			}
			//перевірка на число
			if(isNaN(count)){
				alert('Введіть число!');
				return;
			}
			//перевірка на діапазон
			if(count<0||count>10){
				alert('Введіть число в межах від 0 до 10');
				return;
			}
			//змінити кількість води в кавоварці
			water=count;
		}
		alert('Створена кавоварка потужністю '+power+' ват');
		//k-коефіцієнт теплоємності води (приватна властивість)
		var k=4200;
		//getBoilTime-повертає час приготування кави (приватний метод)
		var getBoilTime=function(){
			var time=k*water*80/this.getPower();
			console.log(time);
			return time;
		}
		.bind(this);
		//showMsg-виводить повідомлення про приготування кави (приватний метод)
		//var self=this;
		function showMsg(){
			alert('Кава готова!');
			ontimer=false;
			clearInterval(timerbar);
			bar.style.width=progress.clientWidth+'px';
			setTimeout(function(){
				bar.style.width=0;
				water=0;
				currentWater.innerHTML=water;
			},1000)
		}
		//run-запуск процесу приготування кави (публічний метод)
		this.run=function(){
			//перевіряємо, чи включена кавоварка
			if(!this.getEnable()){
				alert('Включіть кавоварку!');
				return;
			}
			//перевірка наявності води
			if(!water){
				alert('Залийте воду!');
				return;
			}
			//перевіряємо, чи процес приготування кави вже запущений
			if(ontimer){
				alert('Кава вже готується!');
				return;
			}
			ontimer=true;
			//ширина елемента з id='progress'
			var width=progress.clientWidth;
			//величина, на яку збільшується ширина елемента bar протягом кожних 50 мс  
			var t=(width*50)/getBoilTime();
			var i=1;
			timerbar=setInterval(function(){
				bar.style.width=(t*i)+"px";
				i++;
			},50);
			timer=setTimeout(showMsg,getBoilTime());
		}

		//timer-керування методом setTimeout (приватна властивість)
		var timer=null;
		//stop-зупинка процесу приготування кави (публічний метод)
		this.stop=function(){
			if(!ontimer) return;
			clearTimeout(timer);
			clearInterval(timerbar);
			bar.style.width=0;
			alert('Процес приготування кави перервано!');
			ontimer=false;
		}
		//ontimer-керування методом setInterval (приватна властивість)
		var ontimer=null;
		//timerbar-контроль активації процесу приготування кави
		var timerbar=false;
	}

	//створюємо екземпляр кавоварки і відображаєм текучу кількість води на формі
	var cm=new CoffeeMachine(200);
	//currentWater.innerHTML=cm.water;
	currentWater.innerHTML=cm.getsetWater();

	//змінюєм кількість води в кавоварці
	addWater.onclick=function(){
		var count=countWater.value;
		if(count=='') return;
		//cm.water=count;
		//currentWater.innerHTML=cm.water;
		cm.getsetWater(count);
		currentWater.innerHTML=cm.getsetWater();
		countWater.value='';
	}
	//запускаєм процес приготування кави
	start.onclick=function(){
		cm.run();
	}
	//зупиняєм процес приготування кави
	end.onclick=function(){
		cm.stop();
	}
	onoff.onclick=function(){
		if(cm.getEnable()){
			cm.disabled();
			onoffcolor.style.backgroundColor='red';
			this.value='On';
			cm.stop();
		}
		else{
			cm.enabled();
			onoffcolor.style.backgroundColor='green';
			this.value='Off';
		}
	}
}