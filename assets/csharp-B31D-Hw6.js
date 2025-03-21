import{g as Z}from"./index-DQlsMj_W.js";var k,T;function G(){if(T)return k;T=1,k=y,y.displayName="csharp",y.aliases=["dotnet","cs"];function y(j){(function(t){function r(s,u){return s.replace(/<<(\d+)>>/g,function(f,W){return"(?:"+u[+W]+")"})}function e(s,u,f){return RegExp(r(s,u),"")}function l(s,u){for(var f=0;f<u;f++)s=s.replace(/<<self>>/g,function(){return"(?:"+s+")"});return s.replace(/<<self>>/g,"[^\\s\\S]")}var n={type:"bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",typeDeclaration:"class enum interface record struct",contextual:"add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",other:"abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield"};function d(s){return"\\b(?:"+s.trim().replace(/ /g,"|")+")\\b"}var w=d(n.typeDeclaration),p=RegExp(d(n.type+" "+n.typeDeclaration+" "+n.contextual+" "+n.other)),z=d(n.typeDeclaration+" "+n.contextual+" "+n.other),q=d(n.type+" "+n.typeDeclaration+" "+n.other),g=l(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source,2),h=l(/\((?:[^()]|<<self>>)*\)/.source,2),o=/@?\b[A-Za-z_]\w*\b/.source,b=r(/<<0>>(?:\s*<<1>>)?/.source,[o,g]),i=r(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source,[z,b]),v=/\[\s*(?:,\s*)*\]/.source,A=r(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,[i,v]),F=r(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,[g,h,v]),N=r(/\(<<0>>+(?:,<<0>>+)+\)/.source,[F]),c=r(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,[N,i,v]),a={keyword:p,punctuation:/[<>()?,.:[\]]/},x=/'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,E=/"(?:\\.|[^\\"\r\n])*"/.source,O=/@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;t.languages.csharp=t.languages.extend("clike",{string:[{pattern:e(/(^|[^$\\])<<0>>/.source,[O]),lookbehind:!0,greedy:!0},{pattern:e(/(^|[^@$\\])<<0>>/.source,[E]),lookbehind:!0,greedy:!0}],"class-name":[{pattern:e(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source,[i]),lookbehind:!0,inside:a},{pattern:e(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source,[o,c]),lookbehind:!0,inside:a},{pattern:e(/(\busing\s+)<<0>>(?=\s*=)/.source,[o]),lookbehind:!0},{pattern:e(/(\b<<0>>\s+)<<1>>/.source,[w,b]),lookbehind:!0,inside:a},{pattern:e(/(\bcatch\s*\(\s*)<<0>>/.source,[i]),lookbehind:!0,inside:a},{pattern:e(/(\bwhere\s+)<<0>>/.source,[o]),lookbehind:!0},{pattern:e(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source,[A]),lookbehind:!0,inside:a},{pattern:e(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source,[c,q,o]),inside:a}],keyword:p,number:/(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,operator:/>>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,punctuation:/\?\.?|::|[{}[\];(),.:]/}),t.languages.insertBefore("csharp","number",{range:{pattern:/\.\./,alias:"operator"}}),t.languages.insertBefore("csharp","punctuation",{"named-parameter":{pattern:e(/([(,]\s*)<<0>>(?=\s*:)/.source,[o]),lookbehind:!0,alias:"punctuation"}}),t.languages.insertBefore("csharp","class-name",{namespace:{pattern:e(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,[o]),lookbehind:!0,inside:{punctuation:/\./}},"type-expression":{pattern:e(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source,[h]),lookbehind:!0,alias:"class-name",inside:a},"return-type":{pattern:e(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,[c,i]),inside:a,alias:"class-name"},"constructor-invocation":{pattern:e(/(\bnew\s+)<<0>>(?=\s*[[({])/.source,[c]),lookbehind:!0,inside:a,alias:"class-name"},"generic-method":{pattern:e(/<<0>>\s*<<1>>(?=\s*\()/.source,[o,g]),inside:{function:e(/^<<0>>/.source,[o]),generic:{pattern:RegExp(g),alias:"class-name",inside:a}}},"type-list":{pattern:e(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,[w,b,o,c,p.source,h,/\bnew\s*\(\s*\)/.source]),lookbehind:!0,inside:{"record-arguments":{pattern:e(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source,[b,h]),lookbehind:!0,greedy:!0,inside:t.languages.csharp},keyword:p,"class-name":{pattern:RegExp(c),greedy:!0,inside:a},punctuation:/[,()]/}},preprocessor:{pattern:/(^[\t ]*)#.*/m,lookbehind:!0,alias:"property",inside:{directive:{pattern:/(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,lookbehind:!0,alias:"keyword"}}}});var R=E+"|"+x,S=r(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,[R]),$=l(r(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[S]),2),_=/\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source,U=r(/<<0>>(?:\s*\(<<1>>*\))?/.source,[i,$]);t.languages.insertBefore("csharp","class-name",{attribute:{pattern:e(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source,[_,U]),lookbehind:!0,greedy:!0,inside:{target:{pattern:e(/^<<0>>(?=\s*:)/.source,[_]),alias:"keyword"},"attribute-arguments":{pattern:e(/\(<<0>>*\)/.source,[$]),inside:t.languages.csharp},"class-name":{pattern:RegExp(i),inside:{punctuation:/\./}},punctuation:/[:,]/}}});var m=/:[^}\r\n]+/.source,C=l(r(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[S]),2),D=r(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[C,m]),I=l(r(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source,[R]),2),B=r(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[I,m]);function K(s,u){return{interpolation:{pattern:e(/((?:^|[^{])(?:\{\{)*)<<0>>/.source,[s]),lookbehind:!0,inside:{"format-string":{pattern:e(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source,[u,m]),lookbehind:!0,inside:{punctuation:/^:/}},punctuation:/^\{|\}$/,expression:{pattern:/[\s\S]+/,alias:"language-csharp",inside:t.languages.csharp}}},string:/[\s\S]+/}}t.languages.insertBefore("csharp","string",{"interpolation-string":[{pattern:e(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,[D]),lookbehind:!0,greedy:!0,inside:K(D,C)},{pattern:e(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source,[B]),lookbehind:!0,greedy:!0,inside:K(B,I)}],char:{pattern:RegExp(x),greedy:!0}}),t.languages.dotnet=t.languages.cs=t.languages.csharp})(j)}return k}var H=G();const L=Z(H);export{L as default};
//# sourceMappingURL=csharp-B31D-Hw6.js.map
