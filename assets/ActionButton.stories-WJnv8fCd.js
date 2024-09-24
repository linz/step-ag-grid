import{j as o}from"./jsx-runtime-DEdD30eg.js";import"./stateDeferredHook-DIITot2w.js";import{r}from"./index-RYns6xqu.js";import{A as n}from"./ActionButton-BnaFCZwL.js";import{w as e}from"./util-CWqzvxZb.js";import"./index-DYmNCwer.js";const p={title:"Components / ActionButton",component:n,args:{}},a=()=>{const t=r.useCallback(async()=>{await e(1e3)},[]);return o.jsxs(o.Fragment,{children:[o.jsx(n,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:t}),o.jsx("br",{}),o.jsx(n,{icon:"ic_add","aria-label":"Add new row",onClick:t,level:"primary"}),o.jsx("br",{}),o.jsx(n,{icon:"ic_add","aria-label":"Add new row",onClick:t,level:"primary",className:"ActionButton-tight"}),o.jsx("br",{}),o.jsx(n,{icon:"ic_arrow_forward_right",name:"Continue",onClick:t,iconPosition:"right",level:"secondary",className:"ActionButton-fill",style:{maxWidth:160}}),o.jsx("br",{}),o.jsx(n,{icon:"ic_arrow_forward_right",name:"Disabled",onClick:t,iconPosition:"right",level:"secondary",className:"ActionButton-fill",style:{maxWidth:160},disabled:!0})]})},i=a.bind({});i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const performAction = useCallback(async () => {
    await wait(1000);
  }, []);
  return <>
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={performAction} />
      <br />
      <ActionButton icon={"ic_add"} aria-label={"Add new row"} onClick={performAction} level={"primary"} />
      <br />
      <ActionButton icon={"ic_add"} aria-label={"Add new row"} onClick={performAction} level={"primary"} className={"ActionButton-tight"} />
      <br />
      <ActionButton icon={"ic_arrow_forward_right"} name={"Continue"} onClick={performAction} iconPosition={"right"} level={"secondary"} className={"ActionButton-fill"} style={{
      maxWidth: 160
    }} />
      <br />
      <ActionButton icon={"ic_arrow_forward_right"} name={"Disabled"} onClick={performAction} iconPosition={"right"} level={"secondary"} className={"ActionButton-fill"} style={{
      maxWidth: 160
    }} disabled={true} />
    </>;
}`,...i.parameters?.docs?.source}}};const u=["ActionButtonSimple"];export{i as ActionButtonSimple,u as __namedExportsOrder,p as default};
