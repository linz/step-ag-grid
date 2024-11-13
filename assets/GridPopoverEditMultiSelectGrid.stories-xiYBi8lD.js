import{j as c}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as D,a as F,p as T}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{r as h}from"./index-RYns6xqu.js";import{y as E,z as _,A as j,G as P}from"./GridWrapper-DSHsENPw.js";import{t as V,h as R,i as b,j as q,k as U,l as y,m as N,n as L,o as B,p as H,q as W,r as $,s as X,u as Y,v as J,G as O}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{k as K,l as Q,m as v,n as M,o as A,p as Z,c as z}from"./util-CWqzvxZb.js";import{G as k}from"./GridFormMultiSelectGrid-mjVJ0UCR.js";import"./ActionButton-BnaFCZwL.js";import{w as ee}from"./storybookTestUtil-CYGWFEhE.js";import{EditMultiSelect as te}from"./GridPopoverEditMultiSelect.stories-Bjl4t-ii.js";import"./index-8uelxQvJ.js";var I=1/0,ne=17976931348623157e292;function g(e){if(!e)return e===0?e:0;if(e=V(e),e===I||e===-I){var t=e<0?-1:1;return t*ne}return e===e?e:0}function ie(e){return R(function(t,n){var o=-1,l=n.length,r=l>1?n[l-1]:void 0,s=l>2?n[2]:void 0;for(r=e.length>3&&typeof r=="function"?(l--,r):void 0,s&&E(n[0],n[1],s)&&(r=l<3?void 0:r,l=1),t=Object(t);++o<l;){var i=n[o];i&&e(t,i,o,r)}return t})}var re=Object.prototype,oe=re.hasOwnProperty,ae=_(function(e,t,n){oe.call(e,n)?++e[n]:b(e,n,1)});function G(e,t,n){(n!==void 0&&!q(e[t],n)||n===void 0&&!(t in e))&&b(e,t,n)}function S(e,t){if(!(t==="constructor"&&typeof e[t]=="function")&&t!="__proto__")return e[t]}function se(e){return U(e,y(e))}function le(e,t,n,o,l,r,s){var i=S(e,n),a=S(t,n),w=s.get(a);if(w){G(e,n,w);return}var d=r?r(i,a,n+"",e,t,s):void 0,u=d===void 0;if(u){var m=v(a),p=!m&&K(a),x=!m&&!p&&Q(a);d=a,m||p||x?v(i)?d=i:N(i)?d=L(i):p?(u=!1,d=B(a,!0)):x?(u=!1,d=H(a,!0)):d=[]:W(a)||M(a)?(d=i,M(i)?d=se(i):(!A(i)||Z(i))&&(d=$(a))):u=!1}u&&(s.set(a,d),l(d,a,o,r,s),s.delete(a)),G(e,n,d)}function C(e,t,n,o,l){e!==t&&j(t,function(r,s){if(l||(l=new X),A(r))le(e,t,s,n,C,o,l);else{var i=o?o(S(e,s),r,s+"",e,t,l):void 0;i===void 0&&(i=r),G(e,s,i)}},y)}var de=ie(function(e,t,n,o){C(e,t,n,o)}),ue=Math.ceil,ce=Math.max;function fe(e,t,n,o){for(var l=-1,r=ce(ue((t-e)/(n||1)),0),s=Array(r);r--;)s[++l]=e,e+=n;return s}function me(e){return function(t,n,o){return o&&typeof o!="number"&&E(t,n,o)&&(n=o=void 0),t=g(t),n===void 0?(n=t,t=0):n=g(n),o=o===void 0?t<n?1:-1:g(o),fe(t,n,o)}}var pe=me(),he=R(function(e){return Y(J(e,1,N,!0))});const ge=(e,t)=>P(e,{editor:k,...t,editorParams:{...t.editorParams,className:z("GridMultiSelect-containerMedium",t.editorParams?.className)}}),Ce={title:"Components / Grids",component:O,args:{quickFilterValue:"",selectable:!0},decorators:[e=>c.jsx("div",{style:{width:1024,height:400},children:c.jsx(D,{children:c.jsx(F,{children:c.jsx(e,{})})})})]},Ge=e=>{const[t,n]=h.useState([]),o=h.useMemo(()=>[P({field:"id",headerName:"Id"}),ge({field:"position",headerName:"Position",valueFormatter:({value:r})=>r==null?"":r.join(", ")},{multiEdit:!0,editorParams:{className:"GridMultiSelect-containerUnlimited",options:r=>{const s=de({},...r.map(i=>ae(i.position)),(i,a)=>(i??0)+(a??0));return pe(50024,50067).map(i=>{const a=s[i]==r.length?!0:s[i]>0?"partial":!1;return{value:i,label:`${i}`,checked:a,canSelectPartial:a==="partial"}})},onSave:async({selectedRows:r,addValues:s,removeValues:i})=>(r.forEach(a=>{a.position=he(T(a.position??[],...i),s).sort()}),!0)}})],[]),[l]=h.useState([{id:1e3,position:[50024,50025],position2:"lot1"},{id:1001,position:[50025,50026],position2:"lot2"}]);return c.jsx(O,{...e,animateRows:!0,externalSelectedItems:t,setExternalSelectedItems:n,columnDefs:o,rowData:l,domLayout:"autoHeight"})},f=Ge.bind({});te.play=ee;f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    return [GridCell({
      field: "id",
      headerName: "Id"
    }), GridPopoutEditMultiSelectGrid<ITestRow, ITestRow["position"]>({
      field: "position",
      headerName: "Position",
      valueFormatter: ({
        value
      }) => {
        if (value == null) return "";
        return value.join(", ");
      }
    }, {
      multiEdit: true,
      editorParams: {
        className: "GridMultiSelect-containerUnlimited",
        options: (selectedRows: ITestRow[]) => {
          const counts: Record<number, number> = mergeWith({}, ...selectedRows.map(row => countBy(row.position)), (a: number | undefined, b: number | undefined) => (a ?? 0) + (b ?? 0));
          return range(50024, 50067).map((value): MultiSelectGridOption => {
            const checked = counts[value] == selectedRows.length ? true : counts[value] > 0 ? "partial" : false;
            return {
              value: value,
              label: \`\${value}\`,
              checked,
              canSelectPartial: checked === "partial"
            };
          });
        },
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
    position2: "lot1"
  }, {
    id: 1001,
    position: [50025, 50026],
    position2: "lot2"
  }] as ITestRow[]);
  return <Grid {...props} animateRows={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} />;
}`,...f.parameters?.docs?.source}}};const De=["EditMultiSelectGrid"];export{f as EditMultiSelectGrid,De as __namedExportsOrder,Ce as default};
