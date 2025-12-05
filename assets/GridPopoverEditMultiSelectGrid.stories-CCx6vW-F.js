import{e as w,g as F,h as A,k as j,l as I,m as M,n as _,d as V,j as c}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as h}from"./iframe-fuNulc0f.js";import{r as b,s as q,t as U,G as E,u as L}from"./GridWrapper-BAUk9ZaG.js";import{t as B,d as y,g as H,e as O,f as W,h as $,k as C,i as N,j as X,l as Y,m as J,S as K,n as Q,o as Z,G as T}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{c as z,G as k,a as ee,p as te}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as ne}from"./storybookTestUtil-CrgKzGmM.js";import{EditMultiSelect as re}from"./GridPopoverEditMultiSelect.stories-DyJ03yaV.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";var P=1/0,ie=17976931348623157e292;function g(e){if(!e)return e===0?e:0;if(e=B(e),e===P||e===-P){var t=e<0?-1:1;return t*ie}return e===e?e:0}var R=Object.create,oe=function(){function e(){}return function(t){if(!w(t))return{};if(R)return R(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();function ae(e){return y(function(t,n){var o=-1,l=n.length,i=l>1?n[l-1]:void 0,s=l>2?n[2]:void 0;for(i=e.length>3&&typeof i=="function"?(l--,i):void 0,s&&b(n[0],n[1],s)&&(i=l<3?void 0:i,l=1),t=Object(t);++o<l;){var r=n[o];r&&e(t,r,o,i)}return t})}function se(e){return typeof e.constructor=="function"&&!F(e)?oe(H(e)):{}}var le=Object.prototype,de=le.hasOwnProperty,ue=q(function(e,t,n){de.call(e,n)?++e[n]:O(e,n,1)});function S(e,t,n){(n!==void 0&&!W(e[t],n)||n===void 0&&!(t in e))&&O(e,t,n)}function G(e,t){if(!(t==="constructor"&&typeof e[t]=="function")&&t!="__proto__")return e[t]}function ce(e){return $(e,C(e))}function fe(e,t,n,o,l,i,s){var r=G(e,n),a=G(t,n),x=s.get(a);if(x){S(e,n,x);return}var d=i?i(r,a,n+"",e,t,s):void 0,u=d===void 0;if(u){var m=I(a),p=!m&&A(a),v=!m&&!p&&j(a);d=a,m||p||v?I(r)?d=r:N(r)?d=z(r):p?(u=!1,d=X(a,!0)):v?(u=!1,d=Y(a,!0)):d=[]:J(a)||M(a)?(d=r,M(r)?d=ce(r):(!w(r)||_(r))&&(d=se(a))):u=!1}u&&(s.set(a,d),l(d,a,o,i,s),s.delete(a)),S(e,n,d)}function D(e,t,n,o,l){e!==t&&U(t,function(i,s){if(l||(l=new K),w(i))fe(e,t,s,n,D,o,l);else{var r=o?o(G(e,s),i,s+"",e,t,l):void 0;r===void 0&&(r=i),S(e,s,r)}},C)}var me=ae(function(e,t,n,o){D(e,t,n,o)}),pe=Math.ceil,he=Math.max;function ge(e,t,n,o){for(var l=-1,i=he(pe((t-e)/(n||1)),0),s=Array(i);i--;)s[++l]=e,e+=n;return s}function Se(e){return function(t,n,o){return o&&typeof o!="number"&&b(t,n,o)&&(n=o=void 0),t=g(t),n===void 0?(n=t,t=0):n=g(n),o=o===void 0?t<n?1:-1:g(o),ge(t,n,o)}}var Ge=Se(),we=y(function(e){return Q(Z(e,1,N,!0))});const xe=(e,t)=>E(e,{editor:L,...t,editorParams:{...t.editorParams,className:V("GridMultiSelect-containerMedium",t.editorParams?.className)}}),je={title:"Components / Grids",component:T,args:{quickFilterValue:"",selectable:!0},decorators:[e=>c.jsx("div",{style:{width:1024,height:400},children:c.jsx(k,{children:c.jsx(ee,{children:c.jsx(e,{})})})})]},ve=e=>{const[t,n]=h.useState([]),o=h.useMemo(()=>[E({field:"id",headerName:"Id"}),xe({field:"position",headerName:"Position",valueFormatter:({value:i})=>i==null?"":i.join(", ")},{multiEdit:!0,editorParams:{className:"GridMultiSelect-containerUnlimited",options:i=>{const s=me({},...i.map(r=>ue(r.position)),(r,a)=>(r??0)+(a??0));return Ge(50024,50067).map(r=>{const a=s[r]==i.length?!0:s[r]>0?"partial":!1;return{value:r,label:`${r}`,checked:a,canSelectPartial:a==="partial"}})},onSave:async({selectedRows:i,addValues:s,removeValues:r})=>(i.forEach(a=>{a.position=we(te(a.position??[],...r),s).sort()}),!0)}})],[]),[l]=h.useState([{id:1e3,position:[50024,50025],position2:"lot1"},{id:1001,position:[50025,50026],position2:"lot2"}]);return c.jsx(T,{...e,animateRows:!0,externalSelectedItems:t,setExternalSelectedItems:n,columnDefs:o,rowData:l,domLayout:"autoHeight"})},f=ve.bind({});re.play=ne;f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    return [GridCell({
      field: 'id',
      headerName: 'Id'
    }), GridPopoutEditMultiSelectGrid<ITestRow, ITestRow['position']>({
      field: 'position',
      headerName: 'Position',
      valueFormatter: ({
        value
      }) => {
        if (value == null) return '';
        return value.join(', ');
      }
    }, {
      multiEdit: true,
      editorParams: {
        className: 'GridMultiSelect-containerUnlimited',
        options: (selectedRows: ITestRow[]) => {
          const counts: Record<number, number> = mergeWith({}, ...selectedRows.map(row => countBy(row.position)), (a: number | undefined, b: number | undefined) => (a ?? 0) + (b ?? 0));
          return range(50024, 50067).map((value): MultiSelectGridOption => {
            const checked = counts[value] == selectedRows.length ? true : counts[value] > 0 ? 'partial' : false;
            return {
              value: value,
              label: \`\${value}\`,
              checked,
              canSelectPartial: checked === 'partial'
            };
          });
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        onSave: async ({
          selectedRows,
          addValues,
          removeValues
        }) => {
          selectedRows.forEach(row => {
            row.position = union(pull(row.position ?? [], ...removeValues), addValues).sort();
          });
          return true;
        }
      }
    })];
  }, []);
  const [rowData] = useState([{
    id: 1000,
    position: [50024, 50025],
    position2: 'lot1'
  }, {
    id: 1001,
    position: [50025, 50026],
    position2: 'lot2'
  }] as ITestRow[]);
  return <Grid {...props} animateRows={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />;
}`,...f.parameters?.docs?.source}}};const _e=["EditMultiSelectGrid"];export{f as EditMultiSelectGrid,_e as __namedExportsOrder,je as default};
