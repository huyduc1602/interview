import{g as $}from"./index-b5rJ9-3V.js";var h,k;function E(){if(k)return h;k=1,h=g,g.displayName="markdown",g.aliases=["md"];function g(m){(function(e){var _=/(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;function p(n){return n=n.replace(/<inner>/g,function(){return _}),RegExp(/((?:^|[^\\])(?:\\{2})*)/.source+"(?:"+n+")")}var c=/(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source,d=/\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g,function(){return c}),f=/\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;e.languages.markdown=e.languages.extend("markup",{}),e.languages.insertBefore("markdown","prolog",{"front-matter-block":{pattern:/(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,lookbehind:!0,greedy:!0,inside:{punctuation:/^---|---$/,"front-matter":{pattern:/\S+(?:\s+\S+)*/,alias:["yaml","language-yaml"],inside:e.languages.yaml}}},blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},table:{pattern:RegExp("^"+d+f+"(?:"+d+")*","m"),inside:{"table-data-rows":{pattern:RegExp("^("+d+f+")(?:"+d+")*$"),lookbehind:!0,inside:{"table-data":{pattern:RegExp(c),inside:e.languages.markdown},punctuation:/\|/}},"table-line":{pattern:RegExp("^("+d+")"+f+"$"),lookbehind:!0,inside:{punctuation:/\||:?-{3,}:?/}},"table-header-row":{pattern:RegExp("^"+d+"$"),inside:{"table-header":{pattern:RegExp(c),alias:"important",inside:e.languages.markdown},punctuation:/\|/}}}},code:[{pattern:/((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,lookbehind:!0,alias:"keyword"},{pattern:/^```[\s\S]*?^```$/m,greedy:!0,inside:{"code-block":{pattern:/^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,lookbehind:!0},"code-language":{pattern:/^(```).+/,lookbehind:!0},punctuation:/```/}}],title:[{pattern:/\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:p(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^..)[\s\S]+(?=..$)/,lookbehind:!0,inside:{}},punctuation:/\*\*|__/}},italic:{pattern:p(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^.)[\s\S]+(?=.$)/,lookbehind:!0,inside:{}},punctuation:/[*_]/}},strike:{pattern:p(/(~~?)(?:(?!~)<inner>)+\2/.source),lookbehind:!0,greedy:!0,inside:{content:{pattern:/(^~~?)[\s\S]+(?=\1$)/,lookbehind:!0,inside:{}},punctuation:/~~?/}},"code-snippet":{pattern:/(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,lookbehind:!0,greedy:!0,alias:["code","keyword"]},url:{pattern:p(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),lookbehind:!0,greedy:!0,inside:{operator:/^!/,content:{pattern:/(^\[)[^\]]+(?=\])/,lookbehind:!0,inside:{}},variable:{pattern:/(^\][ \t]?\[)[^\]]+(?=\]$)/,lookbehind:!0},url:{pattern:/(^\]\()[^\s)]+/,lookbehind:!0},string:{pattern:/(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,lookbehind:!0}}}}),["url","bold","italic","strike"].forEach(function(n){["url","bold","italic","strike","code-snippet"].forEach(function(t){n!==t&&(e.languages.markdown[n].inside.content.inside[t]=e.languages.markdown[t])})}),e.hooks.add("after-tokenize",function(n){if(n.language!=="markdown"&&n.language!=="md")return;function t(i){if(!(!i||typeof i=="string"))for(var r=0,u=i.length;r<u;r++){var o=i[r];if(o.type!=="code"){t(o.content);continue}var l=o.content[1],a=o.content[3];if(l&&a&&l.type==="code-language"&&a.type==="code-block"&&typeof l.content=="string"){var s=l.content.replace(/\b#/g,"sharp").replace(/\b\+\+/g,"pp");s=(/[a-z][\w-]*/i.exec(s)||[""])[0].toLowerCase();var b="language-"+s;a.alias?typeof a.alias=="string"?a.alias=[a.alias,b]:a.alias.push(b):a.alias=[b]}}}t(n.tokens)}),e.hooks.add("wrap",function(n){if(n.type==="code-block"){for(var t="",i=0,r=n.classes.length;i<r;i++){var u=n.classes[i],o=/language-(.+)/.exec(u);if(o){t=o[1];break}}var l=e.languages[t];if(l)n.content=e.highlight(x(n.content.value),l,t);else if(t&&t!=="none"&&e.plugins.autoloader){var a="md-"+new Date().valueOf()+"-"+Math.floor(Math.random()*1e16);n.attributes.id=a,e.plugins.autoloader.loadLanguages(t,function(){var s=document.getElementById(a);s&&(s.innerHTML=e.highlight(s.textContent,e.languages[t],t))})}}});var w=RegExp(e.languages.markup.tag.pattern.source,"gi"),v={amp:"&",lt:"<",gt:">",quot:'"'},y=String.fromCodePoint||String.fromCharCode;function x(n){var t=n.replace(w,"");return t=t.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi,function(i,r){if(r=r.toLowerCase(),r[0]==="#"){var u;return r[1]==="x"?u=parseInt(r.slice(2),16):u=Number(r.slice(1)),y(u)}else{var o=v[r];return o||i}}),t}e.languages.md=e.languages.markdown})(m)}return h}var S=E();const R=$(S);export{R as default};
//# sourceMappingURL=markdown-CMTYPo_i.js.map
