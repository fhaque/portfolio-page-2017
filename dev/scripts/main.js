/*************** Natural Language Form ***************/
//NL Form Credit: https://tympanus.net/Tutorials/NaturalLanguageForm/ 
;( function( window ) {
    
        'use strict';
    
        var document = window.document;
    
        if (!String.prototype.trim) {
            String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
        }
    
        function NLForm( el, elClass ) {
            this.el = el;
            this.overlay = this.el.querySelector( '.nl-overlay' );
            this.elClass = (elClass !== undefined) ? '.' + elClass : '';
            this.fields = [];
            this.fldOpen = -1;
            this._init();
        }
    
        NLForm.prototype = {
            _init : function() {
                var self = this;
                Array.prototype.slice.call( this.el.querySelectorAll( 'select' + self.elClass ) ).forEach( function( el, i ) {
                    self.fldOpen++;
                    self.fields.push( new NLField( self, el, 'dropdown', self.fldOpen ) );
                } );
                Array.prototype.slice.call( this.el.querySelectorAll( 'input' + self.elClass + ':not([type="hidden"]):not([type="submit"])' ) ).forEach( function( el, i ) {
                    self.fldOpen++;
                    self.fields.push( new NLField( self, el, 'input', self.fldOpen ) );
                } );
                this.overlay.addEventListener( 'click', function(ev) { self._closeFlds(); } );
                this.overlay.addEventListener( 'touchstart', function(ev) { self._closeFlds(); } );
            },
            _closeFlds : function() {
                if( this.fldOpen !== -1 ) {
                    this.fields[ this.fldOpen ].close();
                }
            }
        };
    
        function NLField( form, el, type, idx ) {
            var parsed = el.getAttribute('data-parsed');
            if (parsed != 1) {
                el.setAttribute('data-parsed', 1);
                this.form = form;
                this.elOriginal = el;
                this.pos = idx;
                this.type = type;
                this._create();
                this._initEvents();
            }
        }
    
        NLField.prototype = {
            _create : function() {
                if( this.type === 'dropdown' ) {
                    this._createDropDown();
                }
                else if( this.type === 'input' ) {
                    this._createInput();
                }
            },
            _createDropDown : function() {
                var self = this;
                this.fld = document.createElement( 'div' );
                this.fld.className = 'nl-field nl-dd';
                this.toggle = document.createElement( 'a' );
                this.toggle.innerHTML = this.elOriginal.options[ this.elOriginal.selectedIndex ].innerHTML;
                this.toggle.className = 'nl-field-toggle';
                this.optionsList = document.createElement( 'ul' );
                var ihtml = '';
                Array.prototype.slice.call( this.elOriginal.querySelectorAll( 'option' ) ).forEach( function( el, i ) {
                    ihtml += self.elOriginal.selectedIndex === i ? '<li class="nl-dd-checked">' + el.innerHTML + '</li>' : '<li>' + el.innerHTML + '</li>';
                    // selected index value
                    if( self.elOriginal.selectedIndex === i ) {
                        self.selectedIdx = i;
                    }
                } );
                this.optionsList.innerHTML = ihtml;
                this.fld.appendChild( this.toggle );
                this.fld.appendChild( this.optionsList );
                this.elOriginal.parentNode.insertBefore( this.fld, this.elOriginal );
                this.elOriginal.style.display = 'none';
            },
            _createInput : function() {
                var self = this;
                this.fld = document.createElement( 'div' );
                this.fld.className = 'nl-field nl-ti-text';
                this.toggle = document.createElement( 'a' );
                this.toggle.innerHTML = this.elOriginal.getAttribute('value')? this.elOriginal.getAttribute('value'): this.elOriginal.getAttribute('placeholder');
                this.toggle.className = 'nl-field-toggle';
                this.optionsList = document.createElement( 'ul' );
                this.getinput = document.createElement( 'input' );
                this.getinput.setAttribute( 'type', this.elOriginal.getAttribute('type')? this.elOriginal.getAttribute('type'): '');
                this.getinput.setAttribute( 'placeholder', this.elOriginal.getAttribute( 'placeholder' ) );
                this.getinput.setAttribute( 'value', this.elOriginal.getAttribute('value')? this.elOriginal.getAttribute('value'): '');
                this.getinputWrapper = document.createElement( 'li' );
                this.getinputWrapper.className = 'nl-ti-input';
                this.inputsubmit = document.createElement( 'button' );
                this.inputsubmit.className = 'nl-field-go';
                this.inputsubmit.innerHTML = 'Go';
                this.getinputWrapper.appendChild( this.getinput );
                this.getinputWrapper.appendChild( this.inputsubmit );
                this.example = document.createElement( 'li' );
                this.example.className = 'nl-ti-example';
                this.example.innerHTML = this.elOriginal.getAttribute( 'data-subline' );
                this.optionsList.appendChild( this.getinputWrapper );
                this.optionsList.appendChild( this.example );
                this.fld.appendChild( this.toggle );
                this.fld.appendChild( this.optionsList );
                this.elOriginal.parentNode.insertBefore( this.fld, this.elOriginal );
                this.elOriginal.style.display = 'none';
            },
            _initEvents : function() {
                var self = this;
                this.toggle.addEventListener( 'click', function( ev ) { ev.preventDefault(); ev.stopPropagation(); self._open(); } );
                this.toggle.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); ev.stopPropagation(); self._open(); } );
    
                if( this.type === 'dropdown' ) {
                    var opts = Array.prototype.slice.call( this.optionsList.querySelectorAll( 'li' ) );
                    opts.forEach( function( el, i ) {
                        el.addEventListener( 'click', function( ev ) { ev.preventDefault(); self.close( el, opts.indexOf( el ) ); } );
                        el.addEventListener( 'hover', function( ev ) { ev.preventDefault(); self.close( el, opts.indexOf( el ), true ); } );
                        el.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); self.close( el, opts.indexOf( el ) ); } );
                    } );
                }
                else if( this.type === 'input' ) {
                    this.getinput.addEventListener( 'keydown', function( ev ) {
                        if ( ev.keyCode == 13 ) {
                            self.close();
                        }
                    } );
                    this.inputsubmit.addEventListener( 'click', function( ev ) { ev.preventDefault(); self.close(); } );
                    this.inputsubmit.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); self.close(); } );
                }
    
            },
            _open : function() {
                if( this.open ) {
                    return false;
                }
                this.open = true;
                this.form.fldOpen = this.pos;
                var self = this;
                this.fld.className += ' nl-field-open';
                this._checkPosition()
            },
            _checkPosition: function() {
                var ul = this.fld.querySelector('ul');
                var left = this._getOffset(ul).left;
    
                var windowWidth = document.documentElement.clientWidth
                    || document.body.clientWidth;
    
                if (windowWidth < left + ul.scrollWidth) {
                    var diff = windowWidth - (left + ul.scrollWidth);
                    ul.style.left = diff+'px';
                }
            },
            _getOffset: function(el) {
                var _x = 0;
                var _y = 0;
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            },
            close : function( opt, idx, flag ) {
                if( !this.open ) {
                    return false;
                }
                if (!flag) {
                    this.open = false;
                    this.form.fldOpen = -1;
                    this.fld.className = this.fld.className.replace(/\b nl-field-open\b/,'');
                }
    
                if( this.type === 'dropdown' ) {
                    if( opt ) {
                        // remove class nl-dd-checked from previous option
                        var selectedopt = this.optionsList.children[ this.selectedIdx ];
                        selectedopt.className = '';
                        opt.className = 'nl-dd-checked';
                        this.toggle.innerHTML = opt.innerHTML;
                        // update selected index value
                        this.selectedIdx = idx;
                        // update original select element´s value
                        this.elOriginal.value = this.elOriginal.children[ this.selectedIdx ].value;
                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            this.elOriginal.dispatchEvent(evt);
                        }
                        else
                            this.elOriginal.fireEvent("change");
                    }
                }
                else if( this.type === 'input' ) {
                    this.getinput.blur();
                    this.toggle.innerHTML = this.getinput.value.trim() !== '' ? this.getinput.value : this.getinput.getAttribute( 'placeholder' );
                    this.elOriginal.value = this.getinput.value;
                }
            }
        };
    
        // add to global namespace
        window.NLForm = NLForm;
    } )( window );

var nlform = new NLForm( document.getElementById( 'nl-form' ) );

/*************** jQuery Modification ***************/

//Credit to: https://stackoverflow.com/questions/20644029/checking-if-a-div-is-visible-within-viewport-using-jquery
$.fn.isOnScreen = function(){
    
        var win = $(window);
    
        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
    
        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();
    
        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
    };

/*************** Main Navigation Object ***************/

var nav = {};
nav.init = function() {
    nav.initBurger();
    nav.initSmoothScroll();
};

nav.initSmoothScroll = function() {
    const $navListLinks = $('.mainNav__list a');
    $navListLinks.on('click',function(e) {
        e.preventDefault();

        const section = $(this).attr('href');

        $('html, body').animate({
            scrollTop: $(section).offset().top
        }, 1000);

    });
}

nav.initBurger = function() {
    const $burger = $('.mainNav__hamburger');
    const $navList = $('.mainNav__list');
    const active = 'mainNav__hamburger--active';

    $burger.on('click', function(e) {
        e.preventDefault();

        $burger.toggleClass(active);

        // $navList.slideToggle(400);
        $navList.toggleClass('mainNav__list--open');
    });
}

/*************** Read More Functionality ***************/

var readMoreLink = {};
readMoreLink.init = function() {
    const $trigger = $('.aboutInfoContent__readMoreLink');
    const $target = $('.aboutInfoContent__extraDescription');
    
    const $triggerText = $('.aboutInfoContent__readMoreLinkText');
    const $bgBlock = $('.aboutInfoContent__readMoreLinkText::after');

    const activeClass = 'aboutInfoContent__readMoreLinkText--active';

    let triggered = false;

    $trigger.on('click', function(e) {
        e.preventDefault();

        $target.slideToggle(1000);

        $triggerText.toggleClass(activeClass);
       

        triggered = !triggered;

        if (triggered) {
            $triggerText.text('Read Less');
            console.log($bgBlock);   
            $bgBlock.hide();
        } else {
            $triggerText.text('Read More');
            $bgBlock.show();
        }

    });
};

/*************** Tooltip Functionality ***************/

var toolTip = {};
toolTip.init = function() {
    const $trigger = $('.devIcons__item');

    $trigger.hover(toolTip.handleMouseEnter, toolTip.handleMouseLeave);

    toolTip.createElement();
};

toolTip.handleMouseEnter = function() {
    const value = $(this).data('value');

    if (value !== undefined && value !== '') {
        $(this).append( toolTip.createElement(value) );
    }
};

toolTip.handleMouseLeave = function() {
    $(this).children('.devIcon__toolTip').remove();
};

toolTip.createElement = function(value) {
    return $('<div>')
                .addClass('devIcon__toolTip')
                .text(value);
};

/*************** Typewriter Animation ***************/

// Credit to: https://codepen.io/designcouch/pen/Atyop
var typeWriter = {};

typeWriter.randomIntFromInterval = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};


typeWriter.typeWrite = function(span, baseRate, minRateDelta, maxRateDelta) {
    $('#'+span).addClass('cursor');

    var text = $('#'+span).text();
    var randInt = 0;

    for (var i = 0; i < text.length; i++) {
        randInt += parseInt(typeWriter.randomIntFromInterval(minRateDelta,maxRateDelta));
        var typing = setTimeout(function(y){
        $('#'+span).append(text.charAt(y));
        },randInt, i);
    };

    setTimeout(function(){
        $('#'+span).removeClass('cursor');
    }, randInt+baseRate);

};

/*************** Typing out Contact area ***************/
var contactFormEndType = { contactEndhasTyped: false };

contactFormEndType.init = function() {
    
    $(window).scroll(function() {
        if ($('#nl-form').isOnScreen() == true && !contactFormEndType.contactEndhasTyped ) {
            typeWriter.typeWrite('typeContactEnd', 7000, 500, 800);
            contactFormEndType.contactEndhasTyped = true;
        }

        
        
    });
}

/*************** Typing out Footer area ***************/
var footerType = { footerHasTyped: false };

footerType.init = function() {
    
    $(window).scroll(function() {
        if ($('footer').isOnScreen() == true && !footerType.footerHasTyped ) {
            typeWriter.typeWrite('typeFooter', 1000, 10, 300);
            footerType.footerHasTyped = true;
        }

        
        
    });
}



/*************** On Window Initialization ***************/


$( function() {
    nav.init();
    readMoreLink.init();

    toolTip.init();

    typeWriter.typeWrite('greetingHeader', 7000, 500, 800);

    contactFormEndType.init();

    footerType.init();
    

});