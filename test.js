
const {exec} = require('child_process');

exec('hexo clean \n hexo g \n hexo server', {cwd: '/home/blog/'}, (err, stdout, stderr) => {
                if (err) {
                    throw Error(err);
                }
                console.info(stdout);
		console.info(stderr);            
})
