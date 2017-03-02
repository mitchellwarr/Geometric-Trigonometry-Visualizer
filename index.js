angular.module('trig', [])
.controller('TrigController', function TrigController($scope) {
    
    var toDegrees = function(radians){
        return radians * (180 / Math.PI);
    };
    
    var toRadians = function(degrees){
        return degrees * (Math.PI / 180);
    };
    
    var init_canvas = function(){
        var width = $scope.canvas.width;
        var height = $scope.canvas.height;
        
        $scope.origin = new Vec($scope.margin, height-$scope.margin);
        $scope.radius = (height < width)?$scope.origin.y/$scope.radiusSize:(width-$scope.origin.x)/$scope.radiusSize;
		if($scope.radius < 0)
			$scope.radius = 0;
        $scope.fontSize = $scope.radius/10;
        
        var ctx = $scope.canvas.getContext("2d");
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "#272943";
        ctx.fill();
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = $scope.color.gridLine;
        ctx.moveTo($scope.origin.x, 0);
        ctx.lineTo($scope.origin.x, height);
        ctx.moveTo(0, $scope.origin.y);
        ctx.lineTo(width, $scope.origin.y);
        ctx.stroke();
    };
    
    var resize_canvas = function(){
        var main = angular.element( document.querySelector( '#main' ) )[0];
        var inputBox = angular.element( document.querySelector( '#inputBox' ) )[0];
        var parent = angular.element( document.querySelector( '#parentCanvas' ) )[0];
        var width = main.clientWidth - inputBox.offsetWidth;
        var height = main.clientHeight;
        var width = parent.clientWidth;
        var height = parent.clientHeight;
        width = (width < 0)? 0 : width;
        
        $scope.canvas.width = width;
        $scope.canvas.height = height;
        init_canvas();
        $scope.updateForm();
    };
    
    var canvas_click_me = function(){
        var ctx = $scope.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = $scope.color.gridLine;
        ctx.font = 10 + "px Calibri";
        ctx.textAlign = "left";
        ctx.fillText("click on screen", $scope.origin.x + 10, 30);
    };
    
    $scope.clickEvent = function(event){
        var rect = $scope.canvas.getBoundingClientRect();
        var click = new Vec(event.clientX - rect.left, event.clientY - rect.top);
        if(click.x < $scope.origin.x)
            click.x = $scope.origin.x;
        if(click.y > $scope.origin.y)
            click.y = $scope.origin.y;
        
        var pos = new Vec($scope.radius, 0);
        pos.rotate($scope.origin.subVec(click).getAngle());
        pos.mulVeci(new Vec(-1, 1));
        $scope.baseXCoords = round(pos.x/$scope.radius, 6);
        $scope.baseYCoords = round(pos.y/$scope.radius, 6);
        $scope.baseAngle = round(toDegrees(pos.getAngle()), 2);
        updateCanvas(click);
    };
    
    var updateCanvas = function(click){
    
        var calculateUserPositions = function(){
            circlePos = new Vec($scope.radius, 0);
            circlePos.rotate($scope.origin.subVec(click).getAngle());
            if(circlePos.x >= 0){
                circlePos.x = 0;
            }
            if(circlePos.y <= 0){
                circlePos.y = 0;
            }
            clickPosition.set(circlePos);
            circlePos.mulVeci(new Vec(-1, 1));
            clickPosition.muli(-1);
            clickPosition.addVeci($scope.origin);
        };
        
        var calculateMathPositions = function(){
            var degrees = toDegrees(circlePos.getAngle());
            circlePos.mulVeci(new Vec(1, -1));
            cos.set(0, circlePos.y);
            sin.set(circlePos.x, 0);
            var secX = (circlePos.x <= 0)?0.0001:circlePos.x;
            var cscY = (circlePos.y >= 0)?-0.0001:circlePos.y;
            sec.set(circlePos.length()*(circlePos.length()/secX), 0);
            csc.set(0, circlePos.length()*(circlePos.length()/cscY));
            circlePos.mulVeci(new Vec(1, -1));
            
            var r = circlePos.length()/circlePos.length();
            var x = circlePos.x/circlePos.length();
            var y = round(circlePos.y/circlePos.length(), 10);
            var roundTo = 4;
            $scope.sin = round(y/r, roundTo);
            $scope.cos = round(x/r, roundTo);
            $scope.tan = round(y/x, roundTo);
            $scope.cot = round(x/y, roundTo);
            $scope.sec = round(r/x, roundTo);
            $scope.csc = round(r/y, roundTo);
            if(y === 0){
                $scope.csc = "--";
                $scope.cot = "--";
            }
            if(x === 0){
                $scope.sec = "--";
                $scope.tan = "--";
            }
        };
        
        var drawCircle = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = $scope.color.circle;
            ctx.arc($scope.origin.x, $scope.origin.y,
                $scope.radius,
                0, 2*Math.PI);
            ctx.stroke();
        };
        
        var drawHypotenuse = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.gridLine;
            ctx.moveTo($scope.origin.x, $scope.origin.y);
            ctx.lineTo(clickPosition.x, clickPosition.y);
            ctx.stroke();
        };
        
        var drawSelectBubble = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.fillStyle = $scope.color.circle;
            ctx.arc(clickPosition.x, clickPosition.y,
                8, 0, 2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = $scope.color.gridLine;
            ctx.arc(clickPosition.x, clickPosition.y,
                4, 0, 2*Math.PI);
            ctx.fill();
        };
        
        var drawCosLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.cosLine;
            var drawCos = cos.addVec($scope.origin);
            ctx.moveTo(clickPosition.x, clickPosition.y);
            ctx.lineTo(drawCos.x, drawCos.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.cosLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textCos = new Vec(-sin.x, sin.y);
            textCos.divi(2).addVeci(clickPosition);
            ctx.fillText("cos", textCos.x, textCos.y-($scope.fontSize/2));
        };
        
        var drawSinLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.sinLine;
            var drawSin = sin.addVec($scope.origin);
            ctx.moveTo(clickPosition.x, clickPosition.y);
            ctx.lineTo(drawSin.x, drawSin.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.sinLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textSin = new Vec(cos.x, -cos.y);
            textSin.divi(2).addVeci(clickPosition);
            ctx.fillText("sin", textSin.x+($scope.fontSize*(3/4)), textSin.y);
        };
        
        var drawTanLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.sinLine;
            var drawSec = sec.addVec($scope.origin);
            if(drawSec.x > 9999999)
                drawSec.x = 9999999;
            ctx.moveTo(clickPosition.x, clickPosition.y);
            ctx.lineTo(drawSec.x, drawSec.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.sinLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textTan = new Vec(sec.x, sec.y);
            textTan.addVeci($scope.origin).subVeci(clickPosition).divi(2).addVeci(clickPosition);
            ctx.fillText("tan", textTan.x+($scope.fontSize*(3/4)), textTan.y);
        };
        
        var drawCotLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.cosLine;
            var drawCsc = csc.addVec($scope.origin);
            if(drawCsc.y < -99999999)
                drawCsc.y = -99999999;
            ctx.moveTo(clickPosition.x, clickPosition.y);
            ctx.lineTo(drawCsc.x, drawCsc.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.cosLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textCot = new Vec(csc.x, csc.y);
            textCot.addVeci($scope.origin).subVeci(clickPosition).divi(2).addVeci(clickPosition);
            ctx.fillText("cot", textCot.x+($scope.fontSize*(3/4)), textCot.y);
        };
        
        var drawSecLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.sinLine;
            var drawSec = sec.addVec($scope.origin);
            if(drawSec.x > 9999999)
                drawSec.x = 9999999;
            ctx.moveTo($scope.origin.x, $scope.origin.y);
            ctx.lineTo(drawSec.x, drawSec.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.sinLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textSec = new Vec(sec.x, sec.y);
            textSec.divi(2).addVeci($scope.origin);
            ctx.fillText("sec", textSec.x, textSec.y+($scope.fontSize*(3/4)));
        };
        
        var drawCscLine = function(ctx){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = $scope.color.cosLine;
            var drawCsc = csc.addVec($scope.origin);
            if(drawCsc.y < -99999999)
                drawCsc.y = -99999999;
            ctx.moveTo($scope.origin.x, $scope.origin.y);
            ctx.lineTo(drawCsc.x, drawCsc.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = $scope.color.cosLine;
            ctx.font = $scope.fontSize + "px Calibri";
            ctx.textAlign = "center";
            var textCsc = new Vec(csc.x, csc.y);
            textCsc.divi(2).addVeci($scope.origin);
            ctx.fillText("csc", textCsc.x-($scope.fontSize*(3/4)), textCsc.y);
        };
        
        var clickPosition = new Vec();
        var circlePos = new Vec();
        var cos = new Vec();
        var sin = new Vec();
        var sec = new Vec();
        var csc = new Vec();
        
        calculateUserPositions();
        init_canvas();
        var ctx = $scope.canvas.getContext("2d");

        calculateMathPositions();
        drawCircle(ctx);
        drawCosLine(ctx);
        drawSinLine(ctx);
        drawTanLine(ctx);
        drawCotLine(ctx);
        drawSecLine(ctx);
        drawCscLine(ctx);
        drawHypotenuse(ctx);
        drawSelectBubble(ctx);
    };
    
    function round(value, decimals) {
        var out = Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        if(String(out).split(".")[0].length > decimals && decimals > 0){
            out = out.toExponential(decimals-1);
        }
        if(isNaN(out))
            out = 0;
        return out;
    }
    
    $scope.updateForm = function(){
        var error = false;
        if (typeof $scope.baseXCoords === 'undefined' || !$scope.baseXCoords)
            $scope.baseXCoords = "";
        if (typeof $scope.baseYCoords === 'undefined' || !$scope.baseYCoords)
            $scope.baseYCoords = "";
        if (typeof $scope.baseAngle === 'undefined' || !$scope.baseAngle)
            $scope.baseAngle = "";
        if(isNaN(parseFloat($scope.baseXCoords)) && $scope.baseXCoords != ""){
            $scope.baseXCoords = "Numbers Only";
            error = true;
        }
        if(isNaN(parseFloat($scope.baseYCoords)) && $scope.baseYCoords != ""){
            $scope.baseYCoords = "Numbers Only";
            error = true;
        }
        if(isNaN(parseFloat($scope.baseAngle)) && $scope.baseAngle != ""){
            $scope.baseAngle = "Numbers Only";
            error = true;
        }
        if(!error){
            if($scope.baseXCoords == ""){
                if($scope.baseYCoords != "" && $scope.baseAngle != ""){
                    $scope.baseXCoords = round($scope.baseYCoords/Math.tan(toRadians($scope.baseAngle)), 6);
                }
            } else if($scope.baseYCoords == ""){
                if($scope.baseXCoords != "" && $scope.baseAngle != ""){
                    $scope.baseYCoords = round($scope.baseXCoords*Math.tan(toRadians($scope.baseAngle)), 6);
                }
            }
            if($scope.baseYCoords != "" && $scope.baseXCoords != ""){
                $scope.baseAngle = round(toDegrees(Math.atan($scope.baseYCoords/$scope.baseXCoords)), 2);
                var pos = new Vec(parseFloat($scope.baseXCoords), parseFloat($scope.baseYCoords));
                pos.mulVeci(new Vec(1, -1));
                pos.addVeci($scope.origin);
                updateCanvas(pos);
            } else if($scope.baseAngle != ""){
                var pos = new Vec(1, 0);
                pos.rotate(toRadians($scope.baseAngle));
                $scope.baseXCoords = pos.x;
                $scope.baseYCoords = pos.y;
                $scope.updateForm();
            } else {
                init_canvas();
                canvas_click_me();
            }
        }
    };
    
    $scope.clearX = function(){
        $scope.baseXCoords = "";
    }
    $scope.clearY = function(){
        $scope.baseYCoords = "";
    }
    $scope.clearA = function(){
        $scope.baseAngle = "";
    }
    
    $scope.color = {
        gridLine: "#ece9fe",
        cosLine: "#07eaa2",
        sinLine: "#eda807",
        circle: "#e20456"
    };
    $scope.fontSize = 10;
    $scope.radius = 0;
    $scope.radiusSize = 3;
    $scope.origin = new Vec();
    $scope.margin = 50;
    $scope.canvas = angular.element( document.querySelector( '#mainCanvas' ) )[0];
    $scope.baseXCoords = "";
    $scope.baseYCoords = "";
    $scope.baseAngle = "";
    
    $scope.sin = "";
    $scope.cos = "";
    $scope.tan = "";
    $scope.cot = "";
    $scope.sec = "";
    $scope.csc = "";
    
    window.addEventListener('resize', resize_canvas, false);
    
    $scope.canvas.addEventListener('mousedown', mousedown, false);
    $scope.canvas.addEventListener('mousemove', mousemove, false);
    $scope.canvas.addEventListener('mouseup', mouseup, false);
    var isMouseDown=false;

    function mousedown(){
        isMouseDown = true;
    }
    function mousemove(event){
        if(isMouseDown){
            $scope.clickEvent(event);
            $scope.$apply();
        }
    }
    function mouseup(){
        isMouseDown = false;
    }
    
    resize_canvas();
});