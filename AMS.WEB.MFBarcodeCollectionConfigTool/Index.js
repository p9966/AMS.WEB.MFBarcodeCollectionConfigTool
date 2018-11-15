/// <reference path="ToolComponents/barcode.html" />
/// <reference path="ToolComponents/barcode.html" />
/// <reference path="jquery-1.8.2.js" />
$(function () {

    window.oncontextmenu = function () { return false; };

    // 设置其他窗口的默认居中位置
    SetOtherDivLocation();

    $('#divMFUI').fadeIn(2000);

    // 设置tbMain的高度为铺满整个屏幕
    $('#tbMain').height(window.innerHeight);

    // 窗口大小改变事件
    $(window).resize(function () {
        $('#tbMain').height(window.innerHeight);
    });

    // 设置MF标题时钟
    window.setInterval(SetTimeNow, 1000, '#tdTitleTime');

    // 为指定标题设置当前时间
    function SetTimeNow(elementID) {
        // #tdTitleTime
        var timeNow = new Date();
        $(elementID).text(timeNow.getHours() + ":" + timeNow.getMinutes());
    }

    // 为操作界面注册一个可以移动事件
    var isMouseDown = false;
    var clickLeft;
    var clickTop;
    $('#divScreenTitle').mousedown(function (evt) {
        if (evt.which == 1) {
            isMouseDown = true;
            clickLeft = evt.offsetX;
            clickTop = evt.offsetY;

            var parentX = $(this).offset().left;
            var parentY = $(this).offset().top;
            //alert($(this).attr('id'));
        }
    })

    $('#divScreenTitle').mousemove(function (evt) {
        if (isMouseDown) {
            $('#divMFUI').offset({
                left: evt.clientX - clickLeft,
                top: evt.clientY - clickTop
            });

        }
    })

    $('#divScreenTitle').mouseup(function (evt) {
        if (isMouseDown) {
            isMouseDown = false;
        }
    })

    // 单击指定控件当然也要将控件记录并且记录当前准备再创建控件
    var selectControl;
    var isCreateControl = false;
    $('#tdControlMenus ol li').click(function (evt) {
        // 记录控件
        selectControl = $(this).attr('val');

        // 设置控件描述
        var controlDes = $(this).attr('des');
        if (typeof (controlDes) == "undefined")
            $('#tdControlSummary').text("控件描述:暂无描述");
        else
            $('#tdControlSummary').text("控件描述:" + controlDes);
        SetControlClickStyle(this);

        // 准备创建控件
        isCreateControl = true;
    });

    // MF屏幕被单击 准备创建控件
    $('#divScreen').click(function (evt) {
        if (!isCreateControl)
            return;

        CreateControls(selectControl);
        isCreateControl = false;

        // 重置鼠标样式
        this.style.cursor = "default";
    });

    // 鼠标在MF屏幕上面移动事件
    $('#divScreen').mousemove(function (evt) {
        // 判断是否为准备创建控件 如果是重置鼠标指针
        if (isCreateControl && selectControl != 'point') {
            this.style.cursor = "crosshair";
        }
        else {
            this.style.cursor = "default";
        }
    });

    // 鼠标移动到指定工具箱中的指定控件
    $('#tdControlMenus ol li').mouseenter(function () {
        if ($(this).attr('val') == selectControl)
            return;
        $(this).css({ "background-color": "rgb(62,62,64)" });
    });

    // 鼠标离开到指定工具箱中的指定控件
    $('#tdControlMenus ol li').mouseleave(function () {
        if ($(this).attr('val') == selectControl)
            return;
        $(this).css({ "background-color": "rgb(45,45,48)" });
    });

    PropertiesSetSuccessful();

    // 为MF屏幕添加右键菜单
    $('#divScreen').bind('contextmenu', function (e) {
        e.preventDefault();

        $('#divMFContextMenu').show().css({
            'left': e.clientX,
            'top': e.clientY
        });
    });

    // MF屏幕右键菜单单击事件
    $('#olMFContextMenu').click(function (evt) {
        $('#divMFContextMenu').hide();
    });

    // 为MF屏幕右键菜单 删除 添加单击事件
    $('#liDel').click(function (evt) {
        $('#divMFContextMenu').hide();

        if ($('#divScreen').length <= 0)
            return;

        var selectControl = $('#selAllControls').val();
        $('#selAllControls option[value = ' + selectControl + ']').remove();
        $('#' + selectControl).remove();

        // 重置保存顺序
        var saveSN = 1;
        var allControls = $('#divScreen div');
        for (var i = 0; i < allControls.length; i++) {
            $(allControls[i]).attr('savesn', saveSN);
            saveSN++;
        }
    });

    // 编译
    var timerBuild;
    $('#imgBuild').click(function (evt) {
        var buildControls = $('#divScreen div');
        // 检查热键是否冲突
        for (var i = 0; i < buildControls.length; i++) {
            var hotKeyVal = $(buildControls[i]).attr('hotkey');
            if (hotKeyVal == 'None')
                continue;
            for (var j = i + 1; j < buildControls.length; j++) {
                var hotKeyVal2 = $(buildControls[j]).attr('hotkey');
                if (hotKeyVal2 == 'None')
                    continue;
                if (hotKeyVal == hotKeyVal2) {
                    var msg = "控件[" + $(buildControls[i]).attr('id') + ']与控件[' + $(buildControls[j]).attr('id') + ']的热键存在冲突!';
                    alert(msg);
                    return;
                }
            }
        }

        // 判断query控件是否都存在热键
        for (var i = 0; i < buildControls.length; i++) {
            if ($(buildControls[i]).attr('type') == 'query' && $(buildControls[i]).attr('hotkey') == 'None') {
                alert('请为控件' + $(buildControls[i]).attr('id') + "设置热键!");
                return;
            }
        }

        // 开始打包
        var buildResult = "";
        if (saveHead.length > 0) {
            buildResult = "head|" + saveHead;
        }

        if (buildControls.length <= 0) {
            alert('MF设计界面暂无控件,请先设计!');
            return;
        }
        $('#divBuildBar').width(0);
        $('#divBuildProcess').fadeIn();
        for (var i = 0; i < buildControls.length; i++) {
            var controlCell = $(buildControls[i]);
            var controlType = controlCell.attr('type');

            if (controlType == 'barcode') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'barcode|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|true|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'num') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'num|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'time') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'time|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'query') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'query|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('filename') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'sn') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'sn|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'fixedCount') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'fixedCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'totalCount') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'totalCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'singleTotalCount') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'singleTotalCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'conditionCount') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'conditionCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'conditionSingleCount') {
                if (buildResult.length > 0)
                    buildResult += '\r\n';
                buildResult += 'conditionSingleCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
        }


        // 开启滚动条
        var buildBar = $('#divBuildBar');
        timerBuild = window.setInterval(function () {
            buildBar.width(buildBar.width() + 1);
            if (buildBar.width() >= $('#divBuildProcess').width() - 20) {
                window.clearInterval(timerBuild);
                funDownload(buildResult, "MF配置文件.txt");
                $('#divBuildProcess').fadeOut();
            }
        }, 1);
    });

    $('#tdBuildToLocal').click(function () {
        var buildControls = $('#divScreen div');
        // 检查热键是否冲突
        for (var i = 0; i < buildControls.length; i++) {
            var hotKeyVal = $(buildControls[i]).attr('hotkey');
            if (hotKeyVal == 'None')
                continue;
            for (var j = i + 1; j < buildControls.length; j++) {
                var hotKeyVal2 = $(buildControls[j]).attr('hotkey');
                if (hotKeyVal2 == 'None')
                    continue;
                if (hotKeyVal == hotKeyVal2) {
                    var msg = "控件[" + $(buildControls[i]).attr('id') + ']与控件[' + $(buildControls[j]).attr('id') + ']的热键存在冲突!';
                    alert(msg);
                    return;
                }
            }
        }

        // 判断query控件是否都存在热键
        for (var i = 0; i < buildControls.length; i++) {
            if ($(buildControls[i]).attr('type') == 'query' && $(buildControls[i]).attr('hotkey') == 'None') {
                alert('请为控件' + $(buildControls[i]).attr('id') + "设置热键!");
                return;
            }
        }

        // 检测保存顺序是否冲突
        for (var i = 0; i < buildControls.length; i++) {
            if ($(buildControls[i]).attr('savecount').length <= 0 || $(buildControls[i]).attr('savecount') == '0') {
                continue;
            }
            for (var j = i + 1; j < buildControls.length; j++) {
                if ($(buildControls[j]).attr('savecount').length <= 0 || $(buildControls[j]).attr('savecount') == '0') {
                    continue;
                }

                if ($(buildControls[i]).attr('savesn') == $(buildControls[j]).attr('savesn')) {
                    alert('控件[' + $(buildControls[i]).attr('id') + "]与控件[" + $(buildControls[j]).attr('id') + "]的保存顺序冲突!");
                    return;
                }
            }
        }

        // 开始打包
        var buildResult = "";
        if (saveHead.length > 0) {
            buildResult = "head|" + saveHead;
        }

        if (buildControls.length <= 0) {
            alert('MF设计界面暂无控件,请先设计!');
            return;
        }

        for (var i = 0; i < buildControls.length; i++) {
            var controlCell = $(buildControls[i]);
            var controlType = controlCell.attr('type');

            if (controlType == 'barcode') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'barcode|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|true|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'num') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'num|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'time') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'time|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'query') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'query|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('filename') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'sn') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'sn|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'fixedCount') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'fixedCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'totalCount') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'totalCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            } else if (controlType == 'singleTotalCount') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'singleTotalCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'conditionCount') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'conditionCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
            else if (controlType == 'conditionSingleCount') {
                if (buildResult.length > 0)
                    buildResult += 'p9966';
                buildResult += 'conditionSingleCount|' + controlCell.attr('caption') + '|' + controlCell.attr('controlheight') + '|' + controlCell.attr('display') + '|' + controlCell.attr('savecount') + '|' + controlCell.attr('splitcount') + '|' + controlCell.attr('hotkey') + '|' + controlCell.attr('savesn')
            }
        }

        window.location.href = "Aimasen://" + buildResult;
    });

    // 停止编译
    $('#tbStopBuild').click(function () {
        window.clearInterval(timerBuild);
        $('#divBuildProcess').fadeOut();
    });

    $('#tdReportBug').click(function () {
        var objControl = $('#divReportBug');
        objControl.fadeIn(500);
    });

    // 报个bug关闭
    $('#tdReportBugClose').click(function () {
        var objControl = $('#divReportBug');
        objControl.fadeOut(500);
    });

    // 播放演示视频
    $('#tdVideo').click(function () {
        $('#divZhezhao').show();
        $('#videoDemo').attr('src', 'demo.mp4');
        $('#divDemoAvi').fadeIn(2000);
        $('#videoDemo').focus();
    });

    $('#divZhezhao').click(function () {
        $('#divDemoAvi').hide();
        $('#divZhezhao').hide();
        $('#videoDemo').attr('src', '#');

    });

    $('#videoDemo').keydown(function (evt) {
        if (evt.keyCode == '27') {
            $('#divDemoAvi').hide();
            $('#divZhezhao').hide();
            $('#videoDemo').attr('src', '#');
        }
    });

    // 发送bug
    var saveHead = "";
    $('#btnReportBugSubmit').click(function () {
        // 判断是否重复发送
        if ($(this).val() != '发送') {
            return;
        }

        var userName = $('#txtUserName');
        var email = $('#txtEmail');
        var reportBug = $('#txtReportBugRecommend');

        // 发送前检查
        if (userName.val().length <= 0) {
            alert('请输入您的名字!');
            userName.focus();
            return;
        }

        if (email.val().length <= 0 || $('#txtEmail').val().indexOf('@') == -1) {
            alert('请输入正确的邮箱地址!');
            email.focus();
            return;
        }

        if (reportBug.val().length <= 0) {
            alert('请输入您的建议或意见!');
            reportBug.focus();
            return;
        }

        $(this).val('正在发送...');
        $.ajax({
            type: "POST",
            url: "ReportBug.ashx",
            data: { 'userName': userName.val(), 'email': email.val(), 'recommend': reportBug.val() },
            success: function (data) {
                if (data == 'ok') {
                    alert('反馈成功,Simple正在加紧处理!');
                }
                else {
                    alert('啊偶,发送失败，紧急反馈请加QQ:1430732833');
                }
                reportBug.val('');
                $('#divReportBug').fadeOut(500);
                $('#btnReportBugSubmit').val('发送');
            }
        });
    });

    // 打开界面设置抬头
    $('#tdSetTitle').click(function () {
        $('#txtTitleName').val(saveHead);
        $('#divSaveTitle').fadeIn();
    });
    $("#tdSaveTitleCancel").click(function () {
        $('#divSaveTitle').fadeOut();
    });

    // 保存抬头
    $('#tdSaveTitleOK').click(function () {
        saveHead = $('#txtTitleName').val();
        $('#divSaveTitle').fadeOut();
    });

    // 下载插件
    $('#tdPlugin').click(function () {
        window.location.href = "AMS.WEB.BrowserDownloadPlugin.exe";
    });
})

function SetOtherDivLocation() {
    // 设置抬头
    $('#divSaveTitle').offset({
        left: window.innerWidth / 2 - $('#divSaveTitle').width() / 2,
        top: window.innerHeight / 2 - $('#divSaveTitle').height() / 2
    });

    // 编译
    $('#divBuildProcess').offset({
        left: window.innerWidth / 2 - $('#divBuildProcess').width() / 2,
        top: window.innerHeight / 2 - $('#divBuildProcess').height() / 2
    });

    // 报个bug
    $('#divReportBug').offset({
        left: window.innerWidth / 2 - $('#divReportBug').width() / 2,
        top: window.innerHeight / 2 - $('#divReportBug').height() / 2
    });

    // 视频演示
    $('#divDemoAvi').offset({
        left: window.innerWidth / 2 - $('#divDemoAvi').width() / 2,
        top: window.innerHeight / 2 - $('#divDemoAvi').height() / 2
    });
}

function funDownload(content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);

    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

// 控件框单击事件
function ControlsClick() {
    ClearTitleBarClass();

    $('#tdControlsTitle').removeClass('clsCommonTool');
    $('#tdControlsTitle').addClass('clsToolsBarFocus');
}

function OperateClick() {
    ClearTitleBarClass();
    $('#divOperateTitleBar').removeClass('clsCommonTool');
    $('#divOperateTitleBar').addClass('clsToolsBarFocus');

    $('#divMFContextMenu').fadeOut();
}

function PropertyClick() {
    ClearTitleBarClass();
    $('#tdPropTitleBar').removeClass('clsCommonTool');
    $('#tdPropTitleBar').addClass('clsToolsBarFocus');
}

function ClearTitleBarClass() {
    if ($('#tdControlsTitle').hasClass('clsToolsBarFocus')) {
        $('#tdControlsTitle').removeClass('clsToolsBarFocus');
        $('#tdControlsTitle').addClass('clsCommonTool');
    }

    if ($('#divOperateTitleBar').hasClass('clsToolsBarFocus')) {
        $('#divOperateTitleBar').removeClass('clsToolsBarFocus');
        $('#divOperateTitleBar').addClass('clsCommonTool');
    }

    if ($('#tdPropTitleBar').hasClass('clsToolsBarFocus')) {
        $('#tdPropTitleBar').removeClass('clsToolsBarFocus');
        $('#tdPropTitleBar').addClass('clsCommonTool');
    }
}

function SetControlClickStyle(own) {
    // 清空其他同类
    $(own).siblings().css({ "background-color": "rgb(45,45,48)" });
    $(own).css({ "background-color": "rgb(51,153,255)" });
}

var autoNo = 1;
function CreateControls(name) {
    // 给生成的控件编号
    var divFrameName = "divControl_" + autoNo;

    // 清空里面所有控件的焦点
    ClearOperateControlsFocus();

    // 创建控件
    if (name == "barcode") {

        // 条码只能是唯一的，判断里面是否存在条码控件
        if (MFScreenHaveControlType('barcode')) {
            alert('屏幕上面已经有条码控件了哦!');
            return;
        }

        $.ajax({
            url: "ToolComponents/barcode.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@TXTVALUE", "txtValue_" + autoNo).replace("@SAVESN", autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'barcode');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == "num") {
        // 数量只能是唯一的，判断里面是否存在数量控件
        if (MFScreenHaveControlType('num')) {
            alert('屏幕上面已经有当前数量控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/Num.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'Num');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    }
    else if (name == "time") {
        $.ajax({
            url: "ToolComponents/Time.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'Time');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    }
    else if (name == 'query') {
        $.ajax({
            url: "ToolComponents/Query.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo).replace('@TXTVALUE', 'txtFile_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'Query');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == "SN") {
        // 序列号只能是唯一的，判断里面是否存在序列号控件
        if (MFScreenHaveControlType('sn')) {
            alert('屏幕上面已经有序列号控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/SerialNum.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'SN');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == 'fixedCount') {
        $.ajax({
            url: "ToolComponents/FixedCount.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'FixedCount');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == 'totalCount') {
        if (MFScreenHaveControlType('totalCount')) {
            alert('屏幕上面已经有总数量控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/TotalCount.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'TotalCount');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == 'conditionCount') {
        if (MFScreenHaveControlType('conditionCount')) {
            alert('屏幕上面已经有条件总数量控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/ConditionCount.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'ConditionCount');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    }
    else if (name == 'conditionSingleCount') {
        if (MFScreenHaveControlType('conditionSingleCount')) {
            alert('屏幕上面已经有条件单品数量控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/ConditionSingleCount.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'ConditionSingleCount');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    } else if (name == 'singleTotalCount') {
        if (MFScreenHaveControlType('singleTotalCount')) {
            alert('屏幕上面已经有单品总数量控件了哦!');
            return;
        }
        $.ajax({
            url: "ToolComponents/SingleTotalCount.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
                $('#divScreen').append(result);

                // 将新增的控件保存到属性控件列表中
                AppendControls(divFrameName, 'SingleTotalCount');

                // 为新增的控件添加单击事件
                $("#" + divFrameName).click(function () {
                    var selectedVal = $(this).attr('id');

                    // 设置控件焦点
                    ClearOperateControlsFocus();
                    $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

                    // 设置控件属性框选项
                    $('#selAllControls').val(divFrameName);

                    // 为控件设置属性
                    SetControlPropertits(selectedVal);
                });

                // 为控件设置属性
                SetControlPropertits(divFrameName);

                autoNo++;
            }
        });
    }
}

function SetControlPropertits(selectedID) {
    var objControl = $('#' + selectedID);
    var controlType = objControl.attr('type');

    // 设置该设置的项目
    var caption = objControl.attr('caption');
    var saveCount = objControl.attr('saveCount');
    var splitCount = objControl.attr('splitCount');
    var hotKey = objControl.attr('hotKey');
    var saveSn = objControl.attr('saveSn');
    var pams = objControl.attr('pams');
    var controlHeight = objControl.attr('controlheight');
    var display = objControl.attr('display');
    var fileName = objControl.attr('filename');

    if (saveCount != '0') {
        $('#selIsSave').val('save');
    }
    else {
        $('#selIsSave').val('Notsave');
    }
    // 显示所有属性
    $('#tbProperty tr').show();
    if (controlType == 'barcode') {

        // 隐藏该隐藏的属性项目
        $('#trDisplay').hide();
        $('#trIsSave').hide();
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'num') {

        // 隐藏该隐藏的属性项目
        // $('#trDisplay').hide();
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
        $('#selDisplay').val(display);
    } else if (controlType == 'time') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'query') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
        $('#txtFileName').val(fileName);
    } else if (controlType == 'sn') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'fixedCount') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'totalCount') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    }
    else if (controlType == 'conditionCount') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    }
    else if (controlType == 'conditionSingleCount') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFixedContent').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    }
    else if (controlType == 'singleTotalCount') {
        // 隐藏该隐藏的属性项目
        $('#trProperty').hide();
        $('#trFileName').hide();
        $('#trHotKey').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    }
}

function MFScreenHaveControlType(clrType) {
    var components = $('#divScreen div');
    for (var i = 0; i < components.length; i++) {
        var type = $(components[i]).attr('type');
        if (type == clrType) {
            return true;
        }
    }
    return false;
}

function AppendControls(name, type) {
    var control = '<option value=' + name + '>' + name + ' [' + type + ']' + '</option>';
    $('#selAllControls').append(control).val(name);
}

function ClearOperateControlsFocus() {
    $('#divScreen div').css({ "border": '0' });
}

function PropertiesSetSuccessful() {
    // 标题
    $('#txtCaption').blur(function () {
        // 判断MF屏幕是否存在控件不存在直接返回
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置该控件的caption属性和该控件下方td的caption
        // 由于控件"query(查询)"存在不同属性，所以我们需要在这里做一下特殊处理
        var divControl = $('#' + selectedControl);
        if (divControl.attr('type') == 'query') {
            divControl.attr('caption', $(this).val());

            // 设置设计器显示标题
            var designTxt = $(this).val() + '[' + $('#selHotKey').val() + ']:';
            // 判断当前文件名是否存在存在的话就是查询功能不存在的话就是类似于固定值功能
            var thisFileName = divControl.attr('filename');
            if (thisFileName.length > 0)
                designTxt += thisFileName;
            $('#tdCaption_' + controlNO).text(designTxt);
        }
        else {
            divControl.attr('caption', $(this).val());
            $('#tdCaption_' + controlNO).text($(this).val());
        }
    });

    // 查询文件名
    $('#txtFileName').blur(function () {
        // 判断MF屏幕是否存在控件不存在直接返回
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 由于控件"query(查询)"存在不同属性，所以我们需要在这里做一下特殊处理
        var divControl = $('#' + selectedControl);
        if (divControl.attr('type') == 'query') {
            divControl.attr('filename', $(this).val());

            // 设置设计器显示标题
            var designTxt = $(divControl).attr('caption') + '[' + $(divControl).attr('hotkey') + ']:';
            // 判断当前文件名是否存在存在的话就是查询功能不存在的话就是类似于固定值功能
            var thisFileName = $(this).val();
            designTxt += thisFileName;
            $('#tdCaption_' + controlNO).text(designTxt);

        }
        else {
            divControl.attr('filename', $(this).val());
            $('#tdCaption_' + controlNO).text($(this).val());
        }
    });

    // 是否保存
    $('#selIsSave').change(function () {
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        if ($('#selIsSave').val() == 'save') {
            $('#txtSaveCount').val(60);

        }
        else {
            $('#txtSaveCount').val(0);
            $('#' + selectedControl).attr('savecount', '0');
            $('#' + selectedControl).attr('savesn', '0');
        }
    })

    // 固定值内容
    $('#txtFixedContent').blur(function () {
        // 判断MF屏幕是否存在控件不存在直接返回
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置该控件的caption属性和该控件下方td的caption
        $('#' + selectedControl).attr('caption', $(this).val());
        $('#tdCaption_' + controlNO).text($(this).val());
    });

    // 保存长度
    $('#txtSaveCount').blur(function () {
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置该控件的保存长度
        if ($(this).val().length <= 0)
            $('#' + selectedControl).attr('savecount', '0');
        else
            $('#' + selectedControl).attr('savecount', $(this).val());
        if ($(this).val() == '0' || $(this).val().length <= 0)
            $('#selIsSave').val('Notsave');
    });

    // 分隔符位数
    $('#txtSplitCount').blur(function () {
        if ($('#divScreen').length <= 0)
            return;
        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置该控件的保存长度
        $('#' + selectedControl).attr('splitcount', $(this).val());
    });

    // 热键值被改变
    $('#selHotKey').change(function () {
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 由于控件"query(查询)"存在不同属性，所以我们需要在这里做一下特殊处理
        var divControl = $('#' + selectedControl);
        if (divControl.attr('type') == 'query') {
            divControl.attr('hotkey', $(this).val());

            // 设置设计器显示标题
            var designTxt = $(divControl).attr('caption') + '[' + $(this).val() + ']:';
            // 判断当前文件名是否存在存在的话就是查询功能不存在的话就是类似于固定值功能
            var thisFileName = divControl.attr('filename');
            if (thisFileName.length > 0)
                designTxt += thisFileName;
            $('#tdCaption_' + controlNO).text(designTxt);
        }
        else {
            divControl.attr('hotkey', $(this).val());
        }
    });

    // 保存顺序
    $('#txtSaveSN').blur(function () {
        if ($('#divScreen').length <= 0)
            return;
        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置该控件的保存长度
        $('#' + selectedControl).attr('savesn', $(this).val());
    });

    // 当前选中控件改变时
    $('#selAllControls').change(function () {
        var selectedVal = $(this).val();

        // 清空MF屏幕上面的所有控件焦点
        ClearOperateControlsFocus();

        // 设置选中控件焦点
        $('#' + selectedVal).css({ 'border': '2px dotted rgb(100,100,100)' });

        // 显示选中控件的属性
        SetControlPropertits(selectedVal);
    });

    // 是否显示该控件
    $('#selDisplay').change(function () {
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 判断是否隐藏该控件
        if ($(this).val() == 'true') {
            $('#' + selectedControl).attr('display', 'true');
            $('#' + selectedControl).show();
        }
        else {
            $('#' + selectedControl).attr('display', 'false');
            $('#' + selectedControl).hide();
        }
    });

    // 设置控件高度
    $('#txtControlHeight').blur(function () {
        if ($('#divScreen').length <= 0)
            return;

        // 找到当前焦点控件
        var selectedControl = $('#selAllControls').val();
        var controlNO = selectedControl.split("_")[1];

        // 设置控件高度
        $('#' + selectedControl).css({ 'height': $(this).val() });
        $('#' + selectedControl).attr('controlheight', $(this).val());
    });
}