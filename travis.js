// 轮播展示项
var TravisSlideShow = function (containerClassName, showWindowClassName, slideShowClassName, leftArrowClassName, rightArrowClassName) {
    var containerClassName = containerClassName;
    var showWindowClassName = showWindowClassName;
    var slideShowClassName = slideShowClassName;
    var leftArrowClassName = leftArrowClassName;
    var rightArrowClassName = rightArrowClassName;
    // 相关配置项
    this.SlideShowStyle = function (itemWidth, itemHeight, itmeMarginRight, itemNumber, slideTime, autoSlideTime) {
        // 获取slideShowContainer
        var slideShowContainer = document.querySelector(containerClassName);
        slideShowContainer.style.position = 'relative';
        // 获取slideShowWindow
        var slideShowWindow = document.querySelector(showWindowClassName);
        // 获取slideShow
        var slideShow = document.querySelector(slideShowClassName);
        // 获取li
        var slideLi = document.querySelectorAll(slideShowClassName + ' li');
        // 设置li向左浮动
        // document.querySelectorAll(slideShowClassName + ' li')[0].style.styleFloat = 'left';
        // 获取左右点击按钮
        var left = document.querySelector(leftArrowClassName);
        var right = document.querySelector(rightArrowClassName);


        // li的宽度
        var itemWidth = itemWidth; // （外部传入）

        // li的高度
        var itemHeight = itemHeight; // (外部传入)

        // li之间的右间距
        var itmeMarginRight = itmeMarginRight; // （外部传入）

        // 每一次轮播的li数量
        var itemNumber = itemNumber; // （外部传入）

        // 设置slideShow的宽度
        slideShow.style.width = '5000px';

        // 设置slideShowWindow的宽度
        slideShowWindow.style.width = itemNumber * itemWidth + (itemNumber - 1) * itmeMarginRight + 'px';
        // 设置slideShowWindow的高度
        slideShowWindow.style.height = itemHeight + 'px';
        // 设置slideShowWindow的overflow为hidden
        slideShowWindow.style.overflow = 'hidden';


        // 轮播到下一幕所需的过度时间(单位：毫秒)
        var slideTime = slideTime; // （外部传入）
        var transitionTimeStr = 'transform ' + slideTime + 'ms ease';

        // 每一次轮播需要移动的距离
        var slideLength = itemNumber * (itemWidth + itmeMarginRight);

        // 复制li，达到无限轮播的效果
        for (var i = 0; i < itemNumber; i++) {
            slideShow.appendChild(slideLi[i].cloneNode(true));
        }

        // 设置li的右间距
        var newSlideLi = document.querySelectorAll(slideShowClassName + ' li');
        for (var i = 0; i < newSlideLi.length; i++) {
            newSlideLi[i].style.marginRight = itmeMarginRight + 'px';
            newSlideLi[i].style.width = itemWidth + 'px';
            newSlideLi[i].style.height = itemHeight + 'px';
            if (!-[1,]) {
                newSlideLi[i].style.styleFloat = 'left';
            } else {
                newSlideLi[i].style.cssFloat = 'left';
            }
        }


        // index参数，用来确定当前轮播的位置
        var index = 0;
        // index的最大值（最后一幕时，index的值）
        var maxIndex = 0;
        if (slideLi.length % itemNumber == 0) {
            maxIndex = slideLi.length / itemNumber - 1;
        } else {
            maxIndex = Math.floor(slideLi.length / itemNumber);
        }

        // 节流
        var lock = true;

        // 自动轮播(轮播间隔时间，以及定时器id)
        var autoSlideTime = autoSlideTime; // （外部传入）
        var timer = null;

        // 右箭头点击事件
        right.addEventListener('click', function () {
            if (!lock) return;
            // 清除自动轮播定时器
            clearInterval(timer);
            // 上锁
            lock = false;
            // 判断是否到达最后一幕
            if (index == maxIndex) {
                // 加上动画，移动到克隆的位置
                slideShow.style.transition = transitionTimeStr;
                slideShow.style.transform = 'translateX(-' + slideLi.length * (itemWidth + itmeMarginRight) + 'px)';

                // 经过过度时间后，切换到第一幕
                setTimeout(function () {
                    slideShow.style.transition = 'none';
                    slideShow.style.transform = 'translateX(0)';
                    index = 0;
                }, slideTime);

            } else {
                index++;
                // 加上动画
                slideShow.style.transition = transitionTimeStr;
                if (index == maxIndex && slideLi.length % itemNumber != 0) {
                    slideShow.style.transform = 'translateX(-' + ((index - 1) * slideLength + (slideLi.length % itemNumber) * (itmeMarginRight + itemWidth)) + 'px)';
                } else {
                    slideShow.style.transform = 'translateX(-' + slideLength * index + 'px)';
                }
            }
            // 解锁
            setTimeout(function () {
                lock = true;
                // 开启自动轮播
                timer = setInterval(function () {
                    auto();
                }, autoSlideTime);
            }, slideTime);
        })
        // 左箭头点击事件
        left.addEventListener('click', function () {
            if (!lock) return;
            // 清除自动轮播定时器
            clearInterval(timer);
            // 上锁
            lock = false;
            // 判断当前是否为第一幕
            if (index == 0) {
                // 去掉过度动画迅速切换到克隆的位置
                slideShow.style.transition = 'none';
                slideShow.style.transform = 'translateX(-' + slideLi.length * (itemWidth + itmeMarginRight) + 'px)';

                // 迅速切换到最后一幕
                setTimeout(function () {
                    // 加上过度动画
                    slideShow.style.transition = transitionTimeStr;
                    slideShow.style.transform = 'translateX(-' + ((slideLi.length - itemNumber) * (itemWidth + itmeMarginRight)) + 'px)';
                }, 0)
                index = maxIndex;
            } else {
                // 加上过度动画
                index--;
                slideShow.style.transition = transitionTimeStr;
                slideShow.style.transform = 'translateX(-' + slideLength * index + 'px)';
            }

            // 解锁
            setTimeout(function () {
                lock = true;
                // 开始自动轮播
                timer = setInterval(function () {
                    auto();
                }, autoSlideTime);
            }, slideTime);
        })

        // 自动轮播
        function auto() {
            right.click();
        }

        // 开始自动轮播
        timer = setInterval(function () {
            auto();
        }, autoSlideTime);

        // 鼠标放在列表上，停止自动轮播
        slideShow.onmouseover = function () {
            clearInterval(timer);
        };
        // 鼠标移出列表，开启自动轮播
        slideShow.onmouseout = function () {
            // 开始自动轮播
            timer = setInterval(function () {
                auto();
            }, autoSlideTime);
        }
    };

    // 箭头位置及样式
    this.ArrowStyle = function (pointer, fontsize, top, leftNumber, rightNumber, color) {
        var pointer = pointer;
        var fontsize = fontsize;
        var top = top;
        var leftNumber = leftNumber;
        var rightNumber = rightNumber;
        var color = color;
        var left = document.querySelector('.left');
        var right = document.querySelector('.right');
        if (pointer) {
            left.style.cursor = 'pointer';
            right.style.cursor = 'pointer';
        } else {
            left.style.cursor = 'unset';
            right.style.cursor = 'unset';
        }

        left.style.fontSize = fontsize + 'px';
        right.style.fontSize = fontsize + 'px';
        left.style.position = 'absolute';
        right.style.position = 'absolute';

        var reg = RegExp(/%/);
        if (String(top).indexOf('%') != -1) {
            left.style.top = top;
            right.style.top = top;
        } else {
            left.style.top = top + 'px';
            right.style.top = top + 'px';
        }
        if (String(leftNumber).indexOf('%') != -1) {
            left.style.left = leftNumber;
        } else {
            left.style.left = leftNumber + 'px';
        }
        if (String(rightNumber).indexOf('%') != -1) {
            right.style.right = rightNumber;
        } else {
            right.style.right = rightNumber + 'px';
        }

        left.style.color = color;
        right.style.color = color;
    }
    // 判断ie或者非ie
    this.IsIE = function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }
}
