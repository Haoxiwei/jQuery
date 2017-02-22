/**
 * Created by Yaphets on 2017/2/17.
 */

//所谓的框架到底是什么？
//jQuery框架其实一个功能代码库，它提供了很多的功能性方法，让我们可以直接调用来做一些事情
//write less do more.
//itcast框架也会是一个功能代码库，它也会提供很多的功能性方法。
//从结构来看，这个框架的核心是itcast函数和itcast函数的原型。
//所有的功能方法都是添加在这两个地方
//从本质上来说，我们的操作都是通过框架对象来进行操作的。框架对象是哪里来的？
//从内部代码看，框架对象是由init构造函数创建出来的，
//但是对用户来说，他直接调用itcast函数就可以创建框架对象了



(function(window,undefined) {



    //创建一个入口函数为itcast的构造函数
    function itcast(html) {
        //返回一个init作为构造函数创建的一个实例对象
        return new itcast.fn.init(html);
    }




    //将传递的参数转换成dom数组，并将dom数组返回作为parseHtml函数的结果输出到页面上
    function parseHtml(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var res = [];
        for (var i = 0; i < div.childNodes.length; i++) {
            res.push(div.childNodes[i]);
        }
        return res;
    };




    //设置itcast构造函数的原型属性
    itcast.fn = itcast.prototype = {
        //设置原型的构造函数为itcast
        constructor: itcast,
        //给所有为itcast构造函数的原型属性添加上length属性
        length: 0,
        //选择器为空字符串
        selector: "",
        //所有是itcast创建出来的实例对象的类型都设置为itcast
        type: 'itcast',

        //创建each map 的实例方法
        //each方法循环遍历数组，把传入的参数传回，如果传入的是对象，就遍历对象，传回对象
        //如果是数组，就遍历数组，然后返回数组
        each: function (func) {
            //因为each方法返回的是原来的值，不会改变，所以直接返回this
            return itcast.each(this, func);
        },
        //map方法跟each方法用法相似，但是使用map方法的话，无论传入的是对象还是数组，返回的都是一个新的数组
        map: function (func) {
            //因为map方法会返回一个新的数组对象，所以创建一个空数组接受调用map静态方法返回的值
            //然后把res数组返回
            var res = [];
            res = itcast.map(this, func);
            return res;
        },

        //init构造函数：创建伪数组对象的构造函数，该函数有一个返回的对象
        //（返回的对象里面包括一个个的dom元素并且拥有length属性，所以是伪数组
        init: function (html) {
             //events 应该是每一个itcast 对象都拥有的方法
            this.events = {}
//                [].push.apply(this,parseHtml(html))
            //进行判断，如果传入的html参数为空或者空字符串，直接return
            if (html == null || html === "") {
                return;  //这里return 的值是构造函数的this
            }
            //如果html参数传入的函数
            if (typeof html === 'function') {
            //如果是一个函数，那么就将  函数绑定到 onload 上，然乎返回
            // onload  = html
                //首先判断是否已有函数
                //最开始的时候，onload 没有绑定任何事件，所以oldfn是undefined
                var oldFn = onload ;
                //判断如果  oldFn 的类型  是函数
                if(typeof  oldFn ===  'function'){
                    //将 onload 绑定一个事件处理函数
                    onload = function(){
                        //在事件处理函数中调用oldfn  星期天函数
                        oldFn();
                        //在调用html：别人出去的函数
                        html();
                    }
                }
                else{
                    //将onload绑定一个事件处理函数  html
                    //当我们执行代码的时候，只会将函数绑定onload事件，只有当onload事件发生的时候
                    onload = html;
                }
                return

            }
            //如果传入的参数是字符串
            if (itcast.isString(html)) {
                //如果html是html标签的字符串
                if (/^</.test(html)) {
                    //通过apply的借调将parseHtml函数得到的dom元素添加到this对象（实例对象中）
                    [].push.apply(this, parseHtml(html));
                }
                //如果传入的是选择器字符串
                else {
                    [].push.apply(this, itcast.select(html));
                    this.selector = html;
                }

            }

            //判断如果传入的参数是html并且传入的html的type属性是itcast
            if (html && html.type === itcast) {
                //this就是新创建的itcast对象，html就是传入的itcast对象
                //将传进来的html对象中的所有元素添加给this对象
                [].push.apply(this, html);
                //用selector属性记录字符串html
                this.selector = html.selector;
                this.events = html.events;
            }

            if (html && html.nodeType) {
                [].push.call(this,html);
            }
            if(html && itcast.isDom(html)){
               [].push.call(this,html)
            }

        }
    }


    //将itcast的原型赋值给init函数的原型，此时init的构造函数的原型和itcast构造函数的原型对象指向同一个原型
     itcast.fn.init.prototype = itcast.fn;

    //给itcast 函数 和itcast 的原型添加混入功能
    itcast.extend  = itcast.fn.extend = function(obj){
        for(var k in obj ){
            this[k] = obj [k];
        }
    }

    //所有静态方法的集合
    //isString方法  each map getStyle 的静态方法
    itcast.extend({
        isString:function(data){
            return typeof data === 'string';
        },
        isDom:function(data){

        },
        //封装一个获取属性的兼容性方法
        getStyle:function(dom ,name){
            if( dom.currentStyle){
                return dom.currentStyle[name];
            }
            else if(window.getComputedStyle){
                return window.getComputedStyle( dom )[name]
            }
        },
        each:function( arr, func ) {
            var i;
            // 在 ES5 中还引入了 Array.isArray 的方法专门来判断数组
            if ( arr instanceof Array || arr.length >= 0) {
                for ( i = 0; i < arr.length; i++ ) {
                    func.call( arr[ i ], i, arr[ i ] );
                }
            } else {
                for ( i in arr ) {
                    func.call( arr[ i ], i, arr[ i ] );
                }
            }
            return arr;
        },
        map:function( arr, func ) {
            var i, res = [], tmp;
            if ( arr instanceof Array || arr.length >= 0 ) {
                for ( i = 0; i < arr.length; i++ ) {
                    tmp = func( arr[ i ], i );
                    if ( tmp != null ) {
                        res.push( tmp );
                    }
                }
            } else {
                for ( i in arr ){
                    tmp = func( arr[ i ], i );
                    if ( tmp != null ) {
                        res.push( tmp );
                    }
                }
            }
            return res;
        }
    })


    //prependTo方法的封装函数，把后面的元素插入到新的元素前面
    function prependChild(parent,element){
        var first = parent.firstChild;
        //insertBefore
        parent.insertBefore(element,first);
    }
    //所有实例对象的方法集合
    itcast.fn.extend({
        toArray:function(){
            //                var res = [];
            //                for(var i=0; i < this.length ;i++){
            //                    res.push(this[i])
            //                }
            //                return res;
            return [].slice.call(this,0);
        },
        //get方法：根据参数index返回对应下标的dom元素，如果index没有传递，那么就返回整个dom元素数组
        get:function(index){
            if(index === undefined){
                return this.toArray(index);
            }
            return this[ index ];
        },

        appendTo:function(dom){
            //如果传入的参数是itcast 对象
            //所以this就不是添加到dom中，就要加到dom[0]中
            if( dom.type == 'itcast'){
                for(var i= 0;i<this.length;i++){
                    dom[0].appendChild(this[i])
                }
            }
            //如果是传入的参数是dom对象
            //所以就把this传入dom对象中
            else if(dom.nodeType){
                for(var i= 0;i<this.length;i++){
                    dom.appendChild(this[i]);
                }
            }

        },
        //当传入的参数是选择器类型
        appendTo1:function(selector){
            //将传入的选择器转换成itcast对象类型，然后进行添加
            var obj = this.constructor( selector);
            //新建一个itcast对象，用来存放本体和复制的元素
            var newObj =this.constructor();
            for(var i= 0;i<this.length;i++){
                for(var j=0;j<obj.length;j++){
                    //进行判断。如果 J是 最后一次循环，就直接把this直接添加到obj中去、
                    var tmp ;
                    //声明一个变量tmp 用来接收本体和复制体的数据
                    if( j == obj.length-1 ){
                        tmp =this[i];
                    }else{
                        //如果不是最后一次，就只把复制出来的this添加到obj中去
                        tmp = this[i].cloneNode(true);
                    }
                    //将本体和复制体添加到newObj对象中去
                    [].push.call(newObj,tmp);
                    //将本体和复制体添加到变量tmp中去
                    obj[j].appendChild(tmp)

                }

            }
            //返回体里面包含了本体和复制出来的元素的itcast对象
            return newObj;
        },

        //appendTo的反代码，一个往前，一个往后，实现效果相反
        append:function(selector){
            var obj1 = this.constructor(selector);
            for(var i=0;i<obj1.length;i++){
                for(var j=0;j<this.length;j++){
                    if(j == 0){
                        this[j].append(obj1[i]);
                    }else{
                        this[j].append(obj1[i].cloneNode(true));
                    }

                }
            }
            return this;
        },

        //往元素前面插入新的元素
        prepend:function(selector) {
            var obj = this.constructor(selector);
            //新建一个itcast对象，用来存放本体和复制的元素
            var newObj = this.constructor();
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < obj.length; j++) {
                    //进行判断。如果 J是 最后一次循环，就直接把this直接添加到obj中去、
                    var tmp;
                    //声明一个变量tmp 用来接收本体和复制体的数据
                    if (j == obj.length - 1) {
                        tmp = this[i];
                    } else {
                        //如果不是最后一次，就只把复制出来的this添加到obj中去
                        tmp = this[i].cloneNode(true);
                    }
                    //将本体和复制体添加到newObj对象中去
                    [].push.call(newObj, tmp);
                    //将本体和复制体添加到变量tmp中去
                    prependChild(obj[j],tmp);
                }
            }
            return newObj
        },
        //首先考虑获得 dom 元素
        eq:function(num){
            var dom;

            //  这里的dom 要么就是undefined ，要么就是 dom 元素

            //如果 dom 为 空
            //返回一个 length 为0 的itcast对象
            //如果 dom不为空
            //将dom对象，包装成 itcast对象


            //如果下标大于0
            if(num >= 0){
                //dom得到的就是对应下标的元素
                dom =this.get( num )
            }else{
                //如果下标小于0 ，得到的也是对应下标的元素
                dom = this.get(this.length +  num );
            }
            //使用dom对象创建一个itcast对象
            return this.constructor(dom);

        }

    })
    //事件处理模块

    itcast.fn.extend({
        //on 事件绑定
        on:function(type,fn){
            //第一次执行type 方法的时候 events属性中没有type 数组
            if(!this.events[type]){
                //如果没有 type 数组 我们就初始化click数组
                this.events[type] = [];


                //这里声明一个变量that，将this 指向 itcast对象改为一个that
                var that = this
                //当itcast 对象中的元素被点击的时候我们应该把数组中保存的函数拿出来一一执行
                //我们应该为itcast 对象中的元素添加事件处理函数
                this.each(function() {
                    //这里面的this 指的就是itcast 对象中的每一个元素
                    //函数 f 里面传入的 e 指的就是绑定的事件
                    var f = function (e) {
                        //因为这里面的this指向发生了改变，this指向的不再是外部的itcast对象
                        //指向的是each遍历的itcast对象中的元素，也就是dom元素，所以下面遍历的时候
                        //需要改变处理函数的  type 数组
                        for (var i = 0; i < that.events[type].length; i++) {
                            //遍历储存事件处理函数的  type  数组，而后按照顺序依次执行数组里面的事件处理函数
                            //that.events[type][i]();
                            //这里使用call 改变 函数的指向，this现在指向的是itcast创建出来的实例对象，e表示要绑定的事件元素
                            that.events[type][i].call(this,e);
                        }
                    }
                    //进行判断，如果有addeventListener 这个方法，就是用这个方法
                    //事件参数 e 从哪里来的？  从事件绑定的函数来的
                    //我们通过addEventListener 绑定事件的处理函数f。那么f就带有了事件参数e
                    if( this.addEventListener){
                        this.addEventListener(type,f)
                    }
                    //没有这种方法，就说明浏览器不兼容这个方法，使用下面这个方法
                    else{
                        this.attachEvent("on" + type ,f)
                    }
                })
            }
            //我们type数组是用来储存事件处理函数的，把传入的fn 函数全部放入  type 数组当中去
            this.events[type].push(fn);
                return this;
        },
        //点击事件
        click:function(fn){
            this.on('click',fn);
        },
        //事件移除off事件
        off:function(type, fn){
            //声明一个arr 记录 当前传入参数
            var arr = this.events[type];
            //进行判断，如果arr 传入了参数并且拥有值
            if(arr ){
                //循环遍历arr ,从后往前进行循环遍历
                for(var i = arr.length-1; i>=0;i--){
                    //如果arr的第 i 项 是传入的要删除的函数，就删除
                    if(arr[i] == fn){
                        arr.splice(i,1)
                    }
                }

            }
            return this
        },

})
    // 所有事件的实现方式
    var arr =("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(' ')

    //遍历数组中的每一个事件字符串
    itcast.each(arr,function(i,v){
        //itcast.fn[v] ==> itcast.fn[ blur ] = function(fn){ };
        itcast.fn[v] = function(fn){
            //最后调用on方法给元素绑定事件。这里面的this指向的就是itcast 对象
            this.on(v,fn);

            return this;
        }
    })








    //hover  ，toggle 实现
    itcast.fn.extend({
        //鼠标经过
        hover:function(fn1,fn2){
            this.mouseover(fn1);
            this.mouseout(fn2);
            return this
        },
        //点击切换
        toggle:function(){
            //申明一个 变量 i
            var i = 0 ;
            //获得toggle  调用时传递的参数
            var args = arguments;
            //为this 对象 中保存的所有元素添加click事件
            this.on("click",function(e){
                //进行判断，如果 i 的值  等于了传入进来的参数的长度
                if( i === args.length ){
                    //将 i 进行初始化
                    i = 0
                }
                //调用args 中保存的参数
                args[i].call(this,e)
                //变量 i 计数 +1
                i++
            })
        }
    })











    //样式操作模块
    itcast.fn.extend({
        //css:function(option){
        //    //option 传入的是键值对
        //    //现在this 的指向指向的是itcast的实例对象，这里的this指的就是实例对象中包含的dom元素
        //    for (var i=0;i<this.length;i++){
        //        //this[i] 指的就是每一个dom元素
        //        //for in 循环遍历  option ，取出键值对的 键和值
        //        for(var k in option ){
        //            //给每一个dom元素设置相应的属性
        //            this[i].style[k] = option[k];
        //        }
        //
        //    }
        //
        //    //支持链式编程，所以返回this
        //    return this;
        //},

        //改良版  一个参数
        css:function(option){
            return this.each(function(){
                for (var k in option ){
                    this.style[ k ] = option [k]
                }
            })
        },
        //在此改良
        css2:function(option){
            //声明变量args 和 len  记录传入的参数的个数和长度
            var args  =arguments,
                len   =args.length;

            //如果传入的参数的长度为2 ，就出现了二种情况，第一种相当于传入的一个{width:"100px"}
            //另外一种情况就相当于获取值
            if(len == 2){
                //这个时候在此进行判断  如果传入的参数前后二个值都是字符串，就相当于上面的第一种情况
                if(itcast.isString(args[0]) && itcast.isString(args[1])){
                    //循环遍历这个值，进行设置，给每一个 DOM 元素设置  属性
                    this.each(function(){
                        this.style[args[0]] = args[1];
                    })
                }
            }
            //进行判断，如果传入的参数长度为1   就相当于传入的是 一个Json格式的对象
            else if(len == 1){
                if(itcast.isString( option )){
                    //通过这种方法获得到的只有行内样式
                    return this[0].style[option] || itcast.getStyle(this[0],option)
                }
                //进行第二次判断，如果传入的参数option 的类型是  对象类型   .css({width:'100px'})
                else if( typeof option === 'object'){
                    //循环遍历传入的dom元素
                    for(var i =0 ; i< this.length ;i ++){
                        //给每个dom元素都绑定上option 参数 传入的属性
                        this.each(function(){
                            for(var k in option ){
                                this.style[k] = option[k];
                            }
                        })
                    }
                }
            }
        },
        //给元素添加类名
        addClass:function( name ){
            //循环遍历每一个dom元素
            this.each(function(){
                //声明一个变量classTxt 接受dom元素的class 熟
                var classTxt = this.className;
                //判断classTxt 是否有值
                if(classTxt){
                    //有值的情况下进行判断，看是否和原来的class属性和需要添加的class属性有重复的现象
                    //如果没有的情况下，就把class 属性加上去
                    if(( " " + classTxt + " ").indexOf(" "+ name +" " == -1)){

                        this.className  += ' ' + name;

                    }
                }

                else{
                    this.className = name;
                }
            })


        },
        //添加移除类名的方法
        removeClass:function( name ){
            //循环遍历每一个dom元素
            this.each(function(){
                //获得每一个dom元素的 class 属性
                var classTxt = this.className;
                //如果有class 属性
                if(classTxt){
                    //声明一个数组把所有的class 属性分割成一个数组
                    var arr = classTxt.split(" ");
                    //循环遍历这个数组，从后往前遍历
                    for(var i= arr.length-1;i>=0;i++){
                        //如果里面有传入的name 相同的属性，就给删除叼
                        if(arr[i] === name){
                            arr.splice(i,1)
                        }
                    }
                    //循环结束以后，在把心的数组赋值给class属性
                    this.className = arr.join( ' ' );
                }

            })
            //支持链式编程，返回这个新的参数
            return this;
        },
        //判断元素是否拥有这个类名的方法
        hasClass:function( name ){
            //循环遍历所有dom元素
            for( var i = 0;i <this.length;i++){
                //遍历每一个类名。如果下标有和传入的参数相一致的类名
                if((" "+this[i].className+" ").indexOf(
                        " "+name+" ") != -1){
                    //就返回true，代表含有这个属性
                    return true
                }
            }
            //如果循环遍历结束，还没有发现和当前传入的类名相一致的类名
            //就相当于没有找到和传入参数一样的类名，返回false
            return false
        },
        toggleClass:function(name){
            if(this.hasClass(name)){
                this.removeClass(name)
            }
            else
            {
                this.addClass(name);
            }
            return this;
        }

    })




    //属性操作模块
    itcast.fn.extend({
        //给元素设置属性:
        // Attr  方法种的setAttribute 可以帮助我们添加自定义属性
        //attr 方法的二个参数必须都是字符串，但是prop方法的第二个参数可以不是字符串

        attr:function(name, value){
            //如果传入的value 有值 或者value 为空字符串
            if(value || value == ""){
                //进行判断，如果传入的的属性名和属性值都是字符串
                if(itcast.isString(name) && itcast.isString(value))
                {
                    //循环遍历dom 元素，然后对每一个dom元素进行属性设置
                    return this.each(function(){
                        this.setAttribute(name ,value)
                    })
                }
            }
            //如果没有传入value值，只传入了name，就相当于获取属性
            else{
                //进行判断。如果 传入的name 是一个字符串，返回该名字属性的值
                if(itcast.isString(name)){
                    return this[0].getAttribute(name,value)
                }
            }
            //支持链式编程
            return this;
        },
        //Prop 方法种的关联数组访问形式不能够添加自定义属性
        // 只能够添加dom元素原有的属性
        prop:function(name, value){
            //如果传入的value 有值 或者value 为空字符串
            if(value || value == ""){
                //进行判断，如果传入的的属性名和属性值都是字符串
                if(itcast.isString(name) && itcast.isString(value))
                {
                    //循环遍历dom 元素，然后对每一个dom元素进行属性设置
                    return this.each(function(){
                        this[name] =value
                    })
                }
            }
            //如果没有传入value值，只传入了name，就相当于获取属性
            else{
                //进行判断。如果 传入的name 是一个字符串，返回该名字属性的值
                if(itcast.isString(name)){
                    return this[0][name]
                }
            }
            //支持链式编程
            return this;
        },
        //设置value
        val:function(v){
            return this.attr("value",v)
        },
        //向页面输出文字和标签的属性
        html:function(html){
            return this.attr('innerHTML',html)
        },
        //向页面输出文字 的属性
        text:function(txt){
            //首先进行判断，如果有txt这个参数或者txt参数为一个空字符串
            if(txt  || txt == ""){
                //循环遍历dom 元素
                this.each(function(){
                    //给每一个dom元素创建一个文本节点，然后把文本节点传入到dom元素里面
                    var temp = document.createTextNode(txt + "");
                    this.appendChild(temp)
                })
            }
            //如果没有传入txt参数，就代表要去获得dom元素中的文本信息
            else
            {
            var arr =[];
                getTxt(this[0],res);
                return res.join( ' ' );
            }
            //返回支持链式编程
            return this





            function getTxt(node,list){
                var arr = node.childNodes;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].nodeType === 3){
                        list.push(arr[i].nodeValue);
                    }
                    if(arr[i] === 1){
                        getTxt(arr[i],list);
                    }
                }
            }
        }


    })


    //动画函数封装模块

    itcast.fn.extend({

        //声明一个变量
        interval:null,
        //封装动画函数     props： 指的是传入的要改变的参数
        //dur ： 动画的持续时间
        //easing：动画执行的是匀速还是变速的
        //fn:代表的是动画传入时的回调函数
        animate:function(props,dur,easing,fn){
            //申明一个变量记录当前 函数this 的指向
            var iobj = this;
            //循环变量调用函数的元素
            this.each(function(){
                //给每一个元素绑定上move 函数
                move(this,props,dur,easing,fn)
            });
            //支持链式编程，返回当前的this
            return this;


            //封装 元素的运动线性， 是匀速 还是  变速
            //currentTime： 动画持续的时间   time： 动画总时间
            //startX： 开始是位置      endX：结束时的位置
            //easing ： 动画的运动过程
            function g(currentTime,time,startX,endX,easing){

                //如果  是 匀速运动
                if(easing == 'line'){
                    // 速度  = 总路程  / 时间
                    var speed = (startX - endX) / time;

                    //位移 = 动画时间 * 速度
                    return currentTime *  speed;
                }

                //如果 是 变速运动
                else if(easing == 'change'){
                    //路程 = 终点位置 - 起点位置
                    var distance = endX - startX;
                    //公式 ： Math.log( t + 1 ) / Math.log( time + 1 ) *distance
                    return Math.log(currentTime + 1) / Math.log(time + 1 ) *distance;
                }
            }
            // 封装一个 动画 函数
            //node： 要移动的元素    props：传入的要改变的参数
            //time： 动画的总时间    easing：动画运动的过程
            //fn ： 动画执行完成以后的回掉函数
            function move (node ,props , time ,easing ,fn ){

                //声明变量
                var start = {},
                    isover =false;
                // for in 循环  传入的参数
                for(var k in props ){
                    //声明变量temp 接受传入的参数 的 类型
                    var temp = itcast.getStyle( node , k );
                    //赋值给对象start
                    start[k] = parseInt(temp);
                }

                //声明开始的时间
                var startTime = +new Date;
                //开启定时器
                iobj.interval = setInterval(function(){

                    //运动的持续时间 =  定时器开始的时间- 开始的时间
                    var deltaTime = (+new Date) - startTime;
                    //如果运动的持续时间  =  运动的总时间
                    if(deltaTime >= time){
                        //清除定时器，把持续时间设置为总时间
                        clearInterval(iobj.interval);
                        deltaTime = time;
                        //变量isover  变为true  表示动画执行完毕，可以执行回掉函数
                        isover = true;
                    }
                    // 设置运动的运动过程
                    easing = easing || 'line';


                    //for in 循环传入的参数
                    for( var k in props ){
                        //给node 元素 设置要改变的值
                        node.style[k]= start[k]+
                                g(deltaTime,time,start[k],parseInt(props[k]),easing)+
                                "px";
                    }

                    //如果isover 变为true ，并且有传入回调函数
                    if(isover && fn){
                        fn.call(node);
                        return
                    }


                },20)
            }
        }
    })




















    //选择器引擎模块
    var select =
        (function () {

            // 正则表达式
            var rnative = /\{\s*\[native/;
            var rtrim = /^\s+|\s+$/g;
            //                             1           2         3     4
            var rbaseselector = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;


            // 基本函数, support 对象, 验证 qsa 与 byclass
            var support = {};

            support.qsa = rnative.test( document.querySelectorAll + '' );
            support.getElementsByClassName =
                rnative.test( document.getElementsByClassName + '' );
            support.trim = rnative.test( String.prototype.trim + '' );
            support.indexOf = rnative.test( Array.prototype.indexOf + '' );


            // 基本方法
            function getByClassName ( className, node ) {
                node = node || document;
                var allElem, res = [], i;

                if ( support.getElementsByClassName ) {
                    return node.getElementsByClassName( className );
                } else {
                    allElem = node.getElementsByTagName( '*' );
                    for ( i = 0; i < allElem.length; i++ ) {
                        if ( allElem[ i ].className === className ) {
                            res.push( allElem[ i ] );
                        }
                    }
                    return res;
                }
            }

            // 自定义实现 trim 方法
            var myTrim = function ( str ) {
                // 表示两端去空格, 然后返回去除空格的结果
                if ( support.trim ) {
                    return str.trim();
                } else {
                    // 自定义实现
                    return str.replace( rtrim, '' );
                }
            }

            var myIndexOf = function ( array, search, startIndex ) {
                startIndex = startIndex || 0;
                if ( support.indexOf ) {
                    return array.indexOf( search, startIndex );
                } else {
                    for ( var i = startIndex; i < array.length; i++ ) {
                        if ( array[ i ] === search ) {
                            return i;
                        }
                    }
                    return -1;
                }
            }


            //去除数组中重复的封装函数
            var unique = function ( array ) {
                var resArray = [], i = 0;
                for ( ; i < array.length; i++ ) {
                    if ( myIndexOf( resArray, array[ i ] ) == -1 ) {
                        resArray.push( array[ i ] );
                    }
                }
                return resArray;
            }

            //basicSelect("div");
            function basicSelect ( selector, node ) {
                node = node || document;
                var m, res;
                if ( m = rbaseselector.exec( selector ) ) {
                    if ( m[ 1 ] ) { // id
                        res = document.getElementById( m[ 1 ] );
                        if ( res ) {
                            return [ res ];
                        } else {
                            return [];
                        }
                    } else if ( m[ 2 ] ) {  // class
                        // return node.getElementsByClassName( m[ 2 ] );
                        return getByClassName( m[ 2 ], node );
                    } else if ( m[ 3 ] ) {
                        return node.getElementsByTagName( m[ 3 ] );
                    } else if ( m[ 4 ] ) {
                        return node.getElementsByTagName( m[ 4 ] );
                    }
                }
                return [];
            }

            //select2("div p .c",results);
            //当进行select2函数调用的时候，将select函数中的results作为参数传递到select2函数中
            //所以select2函数中的results发生改变的时候，select函数中的results也会发生改变。

            function select2 ( selector, results ) {

                results = results || [];

                var selectors = selector.split( ' ' );//["div", "p" ,".c"]

                // 假定 'div p .c'

                var arr = [], node = [ document ];

                //j循环循环的是selectors数组，他会循环3次
                for ( var j = 0; j < selectors.length; j++ ) {
                    //1. i循环循环的是node数组，node数组此时只有一个document对象，所以只会循环1次
                    //2. i循环循环的是node数组，node数组中保存的是上一次查询到的div元素，所以有几个div元素就循环几次
                    //3. i循环循环的是node数组，node数组中保存的是上一次查询到的p元素，所以有几个p元素就循环几次
                    for ( var i = 0; i < node.length; i++ ) {
                        //1.在document里面查找div元素，并将查找的结果放到arr数组中
                        //2.在div元素中查找p元素，并将查找的结果放到arr数组中
                        //3.在p元素中查找.c  元素，并将查找的结果放到arr数组中
                        arr.push.apply( arr, basicSelect( selectors[ j ], node[ i ] ));
                    }

                    //1.把arr数组中保存的div元素赋值给node数组
                    //2.把arr数组中保存的p元素赋值给node数组
                    //3.把arr数组中保存的.c 元素赋值给node数组
                    node = arr;
                    //将arr数组设置为空数组
                    arr = [];
                }
                //将node数组中保存的结果放到results数组中，并将之返回。
                results.push.apply( results, node );
                return results;

            }
            // //                          1           2         3     4
            // var rbaseselector = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;
            function select ( selector, results ) {
                results = results || [];
                var m, temp, selectors, i, subselector;

                if ( typeof selector != 'string' ) return results;

                // 表明参数都没有问题, 接下来就是如何选择
                // 首先判断 qsa 是否可用
                // 然后再 一步步的 自己实现
                if ( support.qsa ) {
                    results.push.apply( results, document.querySelectorAll( selector ) );
                } else {
                    // 不存在再来考虑自己实现
                    //假设selector ： "  div , div p .c ";
                    selectors = selector.split( ',' );  //[ "  div "," div p .c "]
                    // 循环
                    for ( i = 0; i < selectors.length; i++ ) {
                        //去除前后的空格
                        subselector = myTrim( selectors[ i ] );  //["div","div p .c"];
                        // 接下来就是 处理 subselector
                        if ( rbaseselector.test( subselector ) ) {
                            // 基本选择器
                            results.push.apply( results, basicSelect( subselector ) );
                        } else {
                            // select2 函数
                            select2( subselector, results );
                        }
                    }
                }
                // 返回 result
                return unique( results );
            }


            return select;


        })();

    //将select引擎设置为itcast函数的一个成员
    itcast.select = select;



    //将代码放入沙箱以后，外界访问不到，所以要设置一个对外的接口
    window.I = window.itcast =itcast;
})(window)