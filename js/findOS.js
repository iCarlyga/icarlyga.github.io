// This javascript file detects the name and version of the OS of over 98% of online browsers.
// by Gary Von Schilling
// copyright 2009 Juicyorange 

      var findOS = {

        name: '',
        
        version: '',
        
        init: function() {
          var agent = navigator.userAgent.toLowerCase();
          //alert(agent)
          if (agent.indexOf('mac os x') !== -1) {
            this.name = 'mac'
            var index = agent.indexOf('mac os x');
            this.version = agent.substring(index + 9, index + 18);
            this.version = parseFloat(this.version.replace('_', '.')); // mac os x: 10.0-10.6  ==  9.7% 
            if (isNaN(this.version)) this.version = 10.5
         
          } else if (agent.indexOf('win') !== -1) {
            this.name = 'windows'
            var index = agent.indexOf('windows') - 1;
            this.version = agent.substring(index + 9, index + 11);
            if ((agent.indexOf('windows nt') !== -1)) 
            // windows nt: 2000 => 5.0, XP => 5.1, vista => 6.0, 7 => 6.1  ==  87.3 %
            {
              index = agent.indexOf('windows nt') - 1;
              this.version = parseFloat(agent.substring(index + 11, index + 16))
            }
            else if (this.version == '98') this.version = 2.0;
            else if (this.version == '95') this.version = 1.0; // windows: 98 & 95 == 0.7% 
            else this.version = 0; // windows: pre 95 == 0.1%
            if (isNaN(this.version)) this.version = 0
          } else if (agent.indexOf('ppc') !== -1) {
            this.name = 'mac';
            this.version = 9.2; // mac: classic == 0.1 %
          } else {
            this.name = 'linux';
            this.version = 2.6 // linux ==  1.0 %
          }
          if (agent.indexOf('iphone') !== -1) {
          	this.name = 'iphone';
          	this.version = 3.0
          } else if (agent.indexOf('mobile') !== -1) {
          	this.name = 'mobile';
          	this.version = 1
          }
        }
        
       
      }
      //Testing code
      //findOS.init()
      //alert(findOS.name + ' ' + findOS.version)