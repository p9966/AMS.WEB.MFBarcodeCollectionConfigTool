﻿/// <reference path="ToolComponents/barcode.html" />
/// <reference path="ToolComponents/barcode.html" />
/// <reference path="jquery-1.8.2.js" />
$(function () {


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
        console.log('fff');
        if (evt.which == 1) {
            isMouseDown = true;
            clickLeft = evt.offsetX;
            clickTop = evt.offsetY;
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
        if (isCreateControl) {
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

    // 为MF屏幕右键菜单添加失去焦点隐藏事件
    $('#tdOperate').click(function (evt) {
        $('#divMFContextMenu').hide();
    });
})

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

function CreateControls(name) {
    // 给生成的控件编号
    var autoNo = $('#divScreen div').length + 1;
    var divFrameName = "divControl_" + autoNo;

    // 清空里面所有控件的焦点
    ClearOperateControlsFocus();

    // 创建控件
    if (name == "barcode") {
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
            }
        });
    } else if (name == "num") {
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
            }
        });
    }
    else if (name == 'query') {
        $.ajax({
            url: "ToolComponents/Query.html", success: function (data) {
                var result = data.replace("@DIVID", divFrameName).
                replace("@TBID", "tbControls_" + autoNo).replace("@TDCAPTION", "tdCaption_" + autoNo).
                replace("@TDVALUE", "tdValue_" + autoNo).replace("@SAVESN", autoNo).replace('@TDBUTTON', 'tdButton_' + autoNo).
                replace('@BTNQUERY', 'btnQuery_' + autoNo);
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

    // 显示所有属性
    $('#tbProperty tr').show();
    if (controlType == 'barcode') {

        // 隐藏该隐藏的属性项目
        $('#trDisplay').hide();
        $('#trProperty').hide();

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
        //$('#trDisplay').hide();
        //$('#trProperty').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'time') {
        // 隐藏该隐藏的属性项目
        //$('#trDisplay').hide();
        //$('#trProperty').hide();

        // 设置到可视区域
        $('#txtCaption').val(caption);
        $('#txtSaveCount').val(saveCount);
        $('#txtSplitCount').val(splitCount);
        $('#selHotKey').val(hotKey);
        $('#txtSaveSN').val(saveSn);
        $('#selProperty').val(pams);
        $('#txtControlHeight').val(controlHeight);
    } else if (controlType == 'query') {

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
        $('#' + selectedControl).attr('savecount', $(this).val());
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

        // 设置该控件的保存长度
        $('#' + selectedControl).attr('hotkey', $(this).val());
    });

    // 保存顺序
    $('#txtSaveSN').keypress(function () {
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
        if ($(this).val() == 'visible') {
            $('#' + selectedControl).show();
        }
        else {
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
        $('#tdValue_' + controlNO).css({ 'height': $(this).val() });
        $('#' + selectedControl).attr('controlheight', $(this).val());
    });
}