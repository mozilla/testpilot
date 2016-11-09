/*eslint-disable*/
// HACK: Optimizely lives here, because CSP won't let it live inline

import config from '../config';

if (config.optimizelyEnabled) {
	(function() { 
	    var projectId = '5941720679';
	    var scriptTag = document.createElement('script');
	    scriptTag.type = 'text/javascript';
	    scriptTag.async = true;
	    scriptTag.src = 'https://cdn.optimizely.com/js/' + 
	    projectId + '.js';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(scriptTag, s);
	})();
}
/*eslint-enable*/
