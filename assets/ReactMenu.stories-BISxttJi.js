import{j as e,w as l}from"./util-Do7DUC2X.js";/* empty css              */import{G as p,L as I,M as a,V as B,N as x,a1 as _}from"./Grid-CF0nfSDW.js";import"./iframe-fuNulc0f.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const{expect:t}=__STORYBOOK_MODULE_TEST__,w=__STORYBOOK_MODULE_TEST__,{userEvent:m,within:C}=__STORYBOOK_MODULE_TEST__,k={title:"Components / React-menu",component:p,args:{externalSelectedItems:[],setExternalSelectedItems:()=>{}}},s=w.fn(),o=w.fn(),E=()=>e.jsx(e.Fragment,{children:e.jsxs(I,{menuButton:e.jsx(_,{children:"Open menu"}),onItemClick:s,children:[e.jsx(a,{onClick:o,children:"New File"}),e.jsx(a,{children:"Save"}),e.jsxs(B,{label:"Edit",children:[e.jsx(a,{children:"Cut"}),e.jsx(a,{children:"Copy"}),e.jsx(a,{children:"Paste"})]}),e.jsx(a,{children:"Print..."}),e.jsx(x,{}),e.jsx(a,{children:"Exit"})]})}),i=E.bind({});i.play=async({canvasElement:d})=>{const r=C(d),n=async M=>{await m.keyboard(M),await l(100)},u=await r.findByRole("button");t(u).toBeInTheDocument();const c=async()=>{await l(500),await m.click(u),t(await r.findByRole("menuitem",{name:"New File"})).toBeInTheDocument()};await c(),await m.click(u.parentElement),t(r.queryByRole("menuitem",{name:"New File"})).not.toBeInTheDocument(),await c(),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),t(document.activeElement?.innerHTML).toBe("Exit"),await n("{arrowup}"),t(document.activeElement?.innerHTML).toBe("Print..."),await m.type(u.parentElement,"{Escape}"),t(r.queryByRole("menuitem",{name:"New File"})).not.toBeInTheDocument(),await c(),await n("{arrowdown}"),await n("{enter}"),t(s).toHaveBeenCalled(),t(o).toHaveBeenCalled(),s.mockClear(),o.mockClear(),await c(),await n("{arrowdown}"),await l(10),await n("{Tab}"),t(s).toHaveBeenCalled(),t(o).toHaveBeenCalled(),o.mockClear()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <>
      <Menu menuButton={<MenuButton>Open menu</MenuButton>} onItemClick={menuItemClickAction}>
        <MenuItem onClick={newFileAction}>New File</MenuItem>
        <MenuItem>Save</MenuItem>
        <SubMenu label="Edit">
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </SubMenu>
        <MenuItem>Print...</MenuItem>
        <MenuDivider />
        <MenuItem>Exit</MenuItem>
      </Menu>
    </>;
}`,...i.parameters?.docs?.source}}};const R=["ReactMenuControlled"];export{i as ReactMenuControlled,R as __namedExportsOrder,k as default};
