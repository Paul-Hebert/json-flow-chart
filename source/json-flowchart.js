var jsonFlowChart = (function() {
    var populateNodes = function(target, data){
        var targetElement = document.querySelector(target);

        targetElement.className += " json-flowchart"

        var levelCount = 0;

        data.forEach(function(level){
            var levelElement = document.createElement('div');
            levelElement.className = "level";
            levelElement.id = "level" + levelCount;
            levelCount++;

            targetElement.appendChild(levelElement);

            level.forEach(function(node){
                var nodeElement = document.createElement('div');
                nodeElement.className = "node " + node.class;
                nodeElement.setAttribute("data-level", + levelCount);
                nodeElement.id = node.id;

                var header = "<header>" + node.title +  "</header>";
                var content = "<div class='content'>" + node.content + "</div>";

                nodeElement.innerHTML = header + (node.content ===  null ? "" : content);

                levelElement.appendChild(nodeElement);
            });
        });
    }

    var svgNS = "http://www.w3.org/2000/svg";

    var buildLinkHolder = function(target){
        var targetElement = document.querySelector(target);

        var linkHolder = document.createElementNS(svgNS, "svg");
        targetElement.appendChild(linkHolder);
    }

    var getPoint = function(target, element, direction){
        var targetElement = document.querySelector(target);
        var parentOffsetLeft = targetElement.offsetLeft;
        var parentOffsetTop = targetElement.offsetTop;

        var width = element.clientWidth;

        var x = element.offsetLeft - parentOffsetLeft + width/2;
        var y = element.offsetTop + parentOffsetTop;

        return {
            x: x, 
            y: y
        }
    }

    var updateLinks = function(target, data){
        // remove any old links
        document.querySelectorAll(target + ' .link').forEach(function(linkElement){
            linkElement.parentNode.removeChild(linkElement);
        });

        // add new ones
        data.forEach(function(level){
            level.forEach(function(node){
                node.links.forEach(function(link){
                    var currentElement = document.getElementById(node.id);
                    var targetElement = document.getElementById(link);

                    // to do: set up backwards links
                    var descending = currentElement.getAttribute("data-level") < targetElement.getAttribute("data-level");

                    var startingPoint = getPoint(target, currentElement);
                    var endingPoint = getPoint(target, targetElement);

                    var link = document.createElementNS(svgNS, "line");
                    link.className = "link";
                    link.setAttributeNS(null, "x1", startingPoint.x);
                    link.setAttributeNS(null, "y1", startingPoint.y);
                    link.setAttributeNS(null, "x2", endingPoint.x);
                    link.setAttributeNS(null, "y2", endingPoint.y);

                    document.querySelector(target + " svg").appendChild(link);
                });
            });
        });
    }

    return{
        renderChart: function(target, data, options){
            populateNodes(target, data);
            buildLinkHolder(target);
            updateLinks(target, data);
        }
    }
})();