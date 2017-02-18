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


    //创建一个入口函数为itcast的构造函数
    function itcast(html) {
        //返回一个init作为构造函数创建的一个实例对象
        return new itcast.fn.init(html);
    }

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
//                [].push.apply(this,parseHtml(html))
            //进行判断，如果传入的html参数为空或者空字符串，直接return
            if (html == null || html === "") {
                return;  //这里return 的值是构造函数的this
            }
            //如果html参数传入的函数
            if (typeof html === 'function') {

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
                push.apply(this, html);
                //用selector属性记录字符串html
                this.selector = html;
            }

            if (html && html.nodeType) {
                this.push(html);
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
    //isString方法  each map 的静态方法
    itcast.extend({
        isString:function(data){
            return typeof data === 'string';
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