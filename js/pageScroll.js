/*  _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ 

    ++++ Page`z scroll ++++
    
    Powered by . kerry
    
    http://202.248.69.143/~goma/
    
    動作ブラウザ :: IE4+, NN6+, Opera7+
    
    
_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/  */


gValz = new Array();

function pageScroll(_tId)
{
    // スクロールする距離
    gValz.scrollLength = 8;
    
    // 時間（ 1000 = １秒 ）
    var speedLength = 30;
    
    if (gValz.timeId) clearInterval(gValz.timeId);
    if (document.all && !window.opera)
    {   
        with(document.body){
        var winHeight   = clientHeight;
        var docHeight   = scrollHeight;
        var pTopPos     = scrollTop;
        gValz.pLeftPos  = scrollLeft;
        }
        var obj = document.all(_tId);
    }
    else
    {
        var winHeight   = window.innerHeight;
        var docHeight   = document.height;
        var pTopPos     = window.pageYOffset;
        gValz.pLeftPos  = window.pageXOffset;
        var obj = document.getElementById? document.getElementById(_tId): "";
    }

    if (!obj || !docHeight || (obj && !obj.offsetTop)) return true;

    gValz.targetElmPos = obj.offsetTop;
    if (gValz.targetElmPos+ winHeight > docHeight) gValz.targetElmPos = docHeight- winHeight;
    gValz.udFlag    = !!(gValz.targetElmPos<pTopPos);
    gValz.tpTopPos  = pTopPos;
    gValz.timeId    = setInterval("pScrolling()", speedLength);

    return false;
}



function pScrolling()
{   
        var tempPTop = document.all? document.body.scrollTop: window.pageYOffset;
        var endFlag=0;
        if (!gValz.udFlag)
        {
            gValz.tpTopPos += Math.ceil((gValz.targetElmPos- tempPTop) * (gValz.scrollLength/100));
            if (gValz.targetElmPos <= gValz.tpTopPos) endFlag=1;
        }
        else
        {
            gValz.tpTopPos -= Math.ceil((tempPTop- gValz.targetElmPos)* (gValz.scrollLength/100));
            if (gValz.targetElmPos >= gValz.tpTopPos) endFlag=1;
        }
        
        if (endFlag)
        {
            gValz.tpTopPos = gValz.targetElmPos;
            gValz.timeId = clearInterval(gValz.timeId);
        }
        scrollTo(gValz.pLeftPos, gValz.tpTopPos)
}
