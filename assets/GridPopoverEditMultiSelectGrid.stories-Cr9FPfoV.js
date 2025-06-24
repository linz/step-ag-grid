import{j as c}from"./index-uvRZkhe0.js";/* empty css                  */import{c as A,G as F,a as j,p as _}from"./GridUpdatingContextProvider-B593SlzE.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as h}from"./index-DQDNmYQF.js";import{R as b,S as V,T as q,G as E,s as U}from"./GridWrapper-BvIPk76g.js";import{t as B,j as y,r as L,s as C,u as H,v as W,w as O,x as N,y as $,z as X,A as Y,B as J,C as K,D as Q,G as D}from"./Grid-DelFEA_-.js";import{l as w,m as Z,n as z,o as k,j as M,p as P,q as ee,c as te}from"./util-BM2a4RZN.js";import"./ActionButton-CiYuM8e0.js";import{w as ne}from"./storybookTestUtil-DBFt3sMW.js";import{EditMultiSelect as re}from"./GridPopoverEditMultiSelect.stories-CPvb0AWp.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";var I=1/0,ie=17976931348623157e292;function g(e){if(!e)return e===0?e:0;if(e=B(e),e===I||e===-I){var t=e<0?-1:1;return t*ie}return e===e?e:0}var R=Object.create,oe=function(){function e(){}return function(t){if(!w(t))return{};if(R)return R(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();function ae(e){return y(function(t,n){var o=-1,l=n.length,i=l>1?n[l-1]:void 0,s=l>2?n[2]:void 0;for(i=e.length>3&&typeof i=="function"?(l--,i):void 0,s&&b(n[0],n[1],s)&&(i=l<3?void 0:i,l=1),t=Object(t);++o<l;){var r=n[o];r&&e(t,r,o,i)}return t})}function se(e){return typeof e.constructor=="function"&&!Z(e)?oe(L(e)):{}}var le=Object.prototype,ue=le.hasOwnProperty,de=V(function(e,t,n){ue.call(e,n)?++e[n]:C(e,n,1)});function S(e,t,n){(n!==void 0&&!H(e[t],n)||n===void 0&&!(t in e))&&C(e,t,n)}function G(e,t){if(!(t==="constructor"&&typeof e[t]=="function")&&t!="__proto__")return e[t]}function ce(e){return W(e,O(e))}function fe(e,t,n,o,l,i,s){var r=G(e,n),a=G(t,n),x=s.get(a);if(x){S(e,n,x);return}var u=i?i(r,a,n+"",e,t,s):void 0,d=u===void 0;if(d){var m=M(a),p=!m&&z(a),v=!m&&!p&&k(a);u=a,m||p||v?M(r)?u=r:N(r)?u=A(r):p?(d=!1,u=$(a,!0)):v?(d=!1,u=X(a,!0)):u=[]:Y(a)||P(a)?(u=r,P(r)?u=ce(r):(!w(r)||ee(r))&&(u=se(a))):d=!1}d&&(s.set(a,u),l(u,a,o,i,s),s.delete(a)),S(e,n,u)}function T(e,t,n,o,l){e!==t&&q(t,function(i,s){if(l||(l=new J),w(i))fe(e,t,s,n,T,o,l);else{var r=o?o(G(e,s),i,s+"",e,t,l):void 0;r===void 0&&(r=i),S(e,s,r)}},O)}var me=ae(function(e,t,n,o){T(e,t,n,o)}),pe=Math.ceil,he=Math.max;function ge(e,t,n,o){for(var l=-1,i=he(pe((t-e)/(n||1)),0),s=Array(i);i--;)s[++l]=e,e+=n;return s}function Se(e){return function(t,n,o){return o&&typeof o!="number"&&b(t,n,o)&&(n=o=void 0),t=g(t),n===void 0?(n=t,t=0):n=g(n),o=o===void 0?t<n?1:-1:g(o),ge(t,n,o)}}var Ge=Se(),we=y(function(e){return K(Q(e,1,N,!0))});const xe=(e,t)=>E(e,{editor:U,...t,editorParams:{...t.editorParams,className:te("GridMultiSelect-containerMedium",t.editorParams?.className)}}),Fe={title:"Components / Grids",component:D,args:{quickFilterValue:"",selectable:!0},decorators:[e=>c.jsx("div",{style:{width:1024,height:400},children:c.jsx(F,{children:c.jsx(j,{children:c.jsx(e,{})})})})]},ve=e=>{const[t,n]=h.useState([]),o=h.useMemo(()=>[E({field:"id",headerName:"Id"}),xe({field:"position",headerName:"Position",valueFormatter:({value:i})=>i==null?"":i.join(", ")},{multiEdit:!0,editorParams:{className:"GridMultiSelect-containerUnlimited",options:i=>{const s=me({},...i.map(r=>de(r.position)),(r,a)=>(r??0)+(a??0));return Ge(50024,50067).map(r=>{const a=s[r]==i.length?!0:s[r]>0?"partial":!1;return{value:r,label:`${r}`,checked:a,canSelectPartial:a==="partial"}})},onSave:async({selectedRows:i,addValues:s,removeValues:r})=>(i.forEach(a=>{a.position=we(_(a.position??[],...r),s).sort()}),!0)}})],[]),[l]=h.useState([{id:1e3,position:[50024,50025],position2:"lot1"},{id:1001,position:[50025,50026],position2:"lot2"}]);return c.jsx(D,{...e,animateRows:!0,externalSelectedItems:t,setExternalSelectedItems:n,columnDefs:o,rowData:l,domLayout:"autoHeight"})},f=ve.bind({});re.play=ne;f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
}`,...f.parameters?.docs?.source}}};const je=["EditMultiSelectGrid"];export{f as EditMultiSelectGrid,je as __namedExportsOrder,Fe as default};
