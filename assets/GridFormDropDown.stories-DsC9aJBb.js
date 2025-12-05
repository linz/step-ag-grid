import{j as n}from"./util-Do7DUC2X.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{n as i,o as e,I as d}from"./GridWrapper-BAUk9ZaG.js";import{r as p}from"./iframe-fuNulc0f.js";import"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{a as u}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const P={title:"GridForm / Static Tests",component:i,args:{}},m=s=>{const l=[["No options",{options:[]}],["Custom no options",{options:[],noOptionsMessage:"Custom no options"}],["Enabled and disabled",{options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0}]}],["Headers",{options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter",{filtered:"local",options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter custom placeholder",{filtered:"local",filterPlaceholder:"Custom placeholder",filterHelpText:"Filter help text",options:[e("Header 1"),{label:"Option 1",value:1}]}],["Filter help text and default filter text",{filtered:"local",filterHelpText:"Filter help text",filterDefaultValue:"filter",options:[e("Header 1"),{label:"Filter match",value:1},e("ERROR! this header should not be visible"),{label:"ERROR! this option should not be visible",value:2}]}]],a=l.map(()=>p.useRef(null));return n.jsx("div",{className:"react-menu-inline-test",children:n.jsx(u,{children:l.map((o,r)=>n.jsxs("div",{children:[n.jsx("h6",{ref:a[r],children:o[0]}),n.jsx(d.Provider,{value:{anchorRef:a[r],data:{value:o[2]},value:o[2],field:"value"},children:n.jsx(i,{...s,...o[1]})})]},`${r}`))})})},t=m.bind({});t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<GridBaseRow, unknown>) => {
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
