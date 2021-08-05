jQuery.fn.serializeObject = function () {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }
        }
    } catch (e) {
        alert(e.message);
    } finally { }
    return obj;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isChange(a) {
    const change = {
        0: '교환 불가',
        1: '<b><span style="color:blue">월드 내 나의 캐릭터간 이동만 가능</span></b>',
        2: '<b><span style="color:red">교환 불가</span></b>',
        3: '월드 내 나의 캐릭터간 이동만 가능',
        4: '<b><span style="color:blue">월드 내 나의 캐릭터간 1회 이동 가능</span></b>'
    };
    return change[a] || '...?';
}

function getResult() {
    $("#tableRes1>tbody").empty();
    $("#tableRes2>tbody").empty();
    var sum_coin = 0;
    var sum_wish = 0;
    $("input[type=number]").each(function(idx) {
        if ($(this).val()) {
            if (idx < 75) {
                var tmpa = $(this).closest('tr').clone(); 
                var price = parseInt(tmpa.find("td:eq(2)").text());
                var coin = parseInt($(this).val())*price
                sum_coin += coin;
                tmpa.find("td:eq(1)").html($(this).val());
                tmpa.find("td:eq(3)").html(coin);
                $("#tableRes1>tbody").append(tmpa);
            } else {
                var tmpa = $(this).closest('tr').clone(); 
                var price = parseInt(tmpa.find("td:eq(2)").text());
                var coin = parseInt($(this).val())*price
                sum_wish += coin;
                tmpa.find("td:eq(1)").html($(this).val());
                tmpa.find("td:eq(3)").html(coin);
                $("#tableRes2>tbody").append(tmpa);
            }
            
        }
    });
    $("#tableRes1>tfoot").html(`<tr><th colspan="3">총 필요한 블루밍 코인 수</th><th>${numberWithCommas(sum_coin)}</th></tr>`)
    $("#tableRes2>tfoot").html(`<tr><th colspan="3">총 필요한 위시 코인 수</th><th>${numberWithCommas(sum_wish)}</th></tr>`)
}


function tableToJson(table) {
    var data = [];
    var headers = ['name', 'cnt', 'uc', 'price']
    var keyword=['교환 불가','월드 내 나의 캐릭터간 이동만 가능','월드 내 나의 캐릭터간 1회 이동 가능', '"> '];
    var keyRegExp = new RegExp('(' + keyword.join('|') + ')', 'g');

    for(var i=1; i<table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};

        for(var j=0; j<tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML.replace(/(<([^>]+)>)/ig,"").replace(keyRegExp, '').trim();
        }
        data.push(rowData);
    }

    return data;
}

function prev_check() {
    var jsonObj = tableToJson(document.getElementById("tableRes1"));
    if (jsonObj.length == 1) {
        alert("먼저 구매할 물품을 선택해주세요!")
        return false;
    }
}

function aaaa() {
    $('button.ui.positive.button').addClass('disabled');
    $('body').toast({
        title: '생성중...',
        message: '<p style="color:gray">영수증 생성중입니다! 잠시만 기다려주세요</p>',
        showProgress: 'bottom',
        classProgress: 'green'
    });
    var API_URL = "https://241sda46h0.execute-api.ap-northeast-2.amazonaws.com/heejin";
    var jsonObj = tableToJson(document.getElementById("tableRes1"));
    var sum_coin = jsonObj[Object.keys(jsonObj)[jsonObj.length-1]].cnt.replace(',', '')
    if (sum_coin <= 21433) {
        alert("구매할 물품이 적은 경우, 영수증이 정상적으로 표시되지 않는 경우가 있습니다.\n영수증 위 메시지를 확인해주세요!")
    }
    var data = {
        "date_start": getDate(),
        "union": $('#union').dropdown('get value'),
        "want": sum_coin,
        "item": JSON.stringify(jsonObj)
    };
    $.post({
        url: API_URL,
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
           console.log("success");
           $('#ajaxRes').html(` <div class="ui icon message"> <i class="sync alternate icon"></i> <div class="content"> <div class="header"> <h2 style="color:palevioletred" id="message">${data.message}</h2> </div> <p style="font-weight: 100;">썬데이 코인 2배, 유니온 가드닝 매일 수령한다고 가정.</p> </div> </div><img class="ui centered large bordered image" src="data:image/png;base64,${data.img}">`)
        }
     });
}

$(document).ready(function() {
    /* init */
    $('.menu .item').tab();
    $(".final").click(function(){
        getResult()
    });
    $('#dev').popup({
        on: 'hover',
        position: 'bottom right'
    });
    $('img').popup({
        on: 'hover',
        delay: {
            show: 100,
            hide: 100
        },
        position: 'right center'
    });
});


$.getJSON('hair.json', function(items){
    items.sort(() => Math.random() - 0.5);
    $.each(items, function(i, item){
        $("#hair").append(`<div class="item"><img class="ui image" src="/proc/${item.i}.png"><div class="meta">${item.name}</div> </div>`);
    });
});
$.getJSON('clothes.json', function(items){
    items.sort(() => Math.random() - 0.5);
    $.each(items, function(i, item){
        $("#clothes").append(`<div class="item"><img class="ui image" src="/proc2/${item.i}.png"><div class="meta">${item.name}</div> </div>`);
    });
});
$.getJSON('coin3.json', function(items){
    $.each(items, function(i, item){
        $("#coin3>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">월드 내 나의 캐릭터간 이동만 가능</div></h4></td><td>${item.cnt}</td><td>${item.price}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$('#coin3 tr td input').eq(${i}).val(${item.cnt})"> 최대</button></div></td></tr>`);
    });
});