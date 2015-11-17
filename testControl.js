/**
 * Created by Esri on 2015/11/9.
 */

    Controls=function(object){
        var _this=this;
        _this.test=1;
        _this.testText="this is testText";
        _this.testPoproty=function(){
            return _this.testText+"poprty";
        };
        function pan(){
           alert("this is pan");
        }
        _this.publicPan=function(){
            pan();
        }
    };
    Controls.prototype.testprototype="this is prototype";