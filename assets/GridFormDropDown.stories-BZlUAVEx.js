import{j as n}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{l as i,o as e,D as d}from"./GridWrapper-BPNz-Kwc.js";import{r as p}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{a as u}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const P={title:"GridForm / Static Tests",component:i,args:{}},m=s=>{const r=[["No options",{options:[]}],["Custom no options",{options:[],noOptionsMessage:"Custom no options"}],["Enabled and disabled",{options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0}]}],["Headers",{options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter",{filtered:"local",options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter custom placeholder",{filtered:"local",filterPlaceholder:"Custom placeholder",filterHelpText:"Filter help text",options:[e("Header 1"),{label:"Option 1",value:1}]}],["Filter help text and default filter text",{filtered:"local",filterHelpText:"Filter help text",filterDefaultValue:"filter",options:[e("Header 1"),{label:"Filter match",value:1},e("ERROR! this header should not be visible"),{label:"ERROR! this option should not be visible",value:2}]}]],a=r.map(()=>p.useRef(null));return n.jsx("div",{className:"react-menu-inline-test",children:n.jsx(u,{children:r.map((o,l)=>n.jsxs("div",{children:[n.jsx("h6",{ref:a[l],children:o[0]}),n.jsx(d.Provider,{value:{anchorRef:a[l],data:{value:o[2]},value:o[2],field:"value"},children:n.jsx(i,{...s,...o[1]})})]},`${l}`))})})},t=m.bind({});t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<GridBaseRow, unknown>) => {
  const configs: [string, GridFormDropDownProps<GridBaseRow, unknown>, string?][] = [['No options', {
    options: []
  }], ['Custom no options', {
    options: [],
    noOptionsMessage: 'Custom no options'
  }], ['Enabled and disabled', {
    options: [{
      label: 'Enabled',
      value: 1
    }, {
      label: 'Disabled',
      value: 0,
      disabled: true
    }]
  }], ['Headers', {
    options: [MenuHeaderItem('Header 1'), {
      label: 'Option 1',
      value: 1
    }, MenuHeaderItem('Header 2'), {
      label: 'Option 2',
      value: 2
    }]
  }], ['Filter', {
    filtered: 'local',
    options: [MenuHeaderItem('Header 1'), {
      label: 'Option 1',
      value: 1
    }, MenuHeaderItem('Header 2'), {
      label: 'Option 2',
      value: 2
    }]
  }], ['Filter custom placeholder', {
    filtered: 'local',
    filterPlaceholder: 'Custom placeholder',
    filterHelpText: 'Filter help text',
    options: [MenuHeaderItem('Header 1'), {
      label: 'Option 1',
      value: 1
    }]
  }], ['Filter help text and default filter text', {
    filtered: 'local',
    filterHelpText: 'Filter help text',
    filterDefaultValue: 'filter',
    options: [MenuHeaderItem('Header 1'), {
      label: 'Filter match',
      value: 1
    }, MenuHeaderItem('ERROR! this header should not be visible'), {
      label: 'ERROR! this option should not be visible',
      value: 2
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
              <GridFormDropDown {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>)}
      </GridContextProvider>
    </div>;
}`,...t.parameters?.docs?.source}}};const g=["GridFormDropDown_"];export{t as GridFormDropDown_,g as __namedExportsOrder,P as default};
