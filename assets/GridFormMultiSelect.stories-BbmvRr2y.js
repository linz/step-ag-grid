import{j as e}from"./util-CgugAU5W.js";/* empty css              *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{w as s,I as l}from"./GridWrapper-ByjUL_3E.js";import{r as p}from"./iframe-qoNDcQrb.js";import"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{a as c}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const R={title:"GridForm / Static Tests",component:s,args:{}},d=a=>{const r=[["No options",{options:[]}],["Custom no options",{options:[],noOptionsMessage:"Custom no options"}],["With options",{options:[{label:"One",value:0,checked:!0},{label:"Two",value:1}]}],["With filter",{filtered:!0,options:[{label:"One",value:0},{label:"With warning",value:1,warning:"Test warning"},{label:"Three",value:2,checked:!0}]}]],i=r.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(c,{children:r.map((n,t)=>e.jsxs("div",{children:[e.jsx("h6",{ref:i[t],children:n[0]}),e.jsx(l.Provider,{value:{anchorRef:i[t],data:{value:n[2]},value:n[2],field:"value"},children:e.jsx(s,{...a,...n[1]})})]},`${t}`))})})},o=d.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
  const configs: [string, GridFormMultiSelectProps<GridBaseRow>, string?][] = [['No options', {
    options: []
  }], ['Custom no options', {
    options: [],
    noOptionsMessage: 'Custom no options'
  }], ['With options', {
    options: [{
      label: 'One',
      value: 0,
      checked: true
    }, {
      label: 'Two',
      value: 1
    }]
  }], ['With filter', {
    filtered: true,
    options: [{
      label: 'One',
      value: 0
    }, {
      label: 'With warning',
      value: 1,
      warning: 'Test warning'
    }, {
      label: 'Three',
      value: 2,
      checked: true
    }]
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        {configs.map((config, index) => <div key={\`\${index}\`}>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={{
          anchorRef: anchorRefs[index],
          data: {
            value: config[2]
          },
          value: config[2],
          field: 'value'
        } as any as GridPopoverContextType<any>}>
              <GridFormMultiSelect {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>)}
      </GridContextProvider>
    </div>;
}`,...o.parameters?.docs?.source}}};const T=["GridFormMultiSelect_"];export{o as GridFormMultiSelect_,T as __namedExportsOrder,R as default};
