import{j as e}from"./index-_eCCCJMN.js";/* empty css              */import{f as w,w as p,e as t,u as c}from"./index-DJy14G1K.js";import{G as I,c as x,M as a,S as B,d as C,e as h}from"./Grid-BnijaEma.js";import"./index-ne9I_3bB.js";import{w as l}from"./util-DX3mDqFH.js";import"./index-JPfhvaY4.js";const S={title:"Components / React-menu",component:I,args:{externalSelectedItems:[],setExternalSelectedItems:()=>{}}},s=w(),o=w(),y=()=>e.jsx(e.Fragment,{children:e.jsxs(x,{menuButton:e.jsx(h,{children:"Open menu"}),onItemClick:s,children:[e.jsx(a,{onClick:o,children:"New File"}),e.jsx(a,{children:"Save"}),e.jsxs(B,{label:"Edit",children:[e.jsx(a,{children:"Cut"}),e.jsx(a,{children:"Copy"}),e.jsx(a,{children:"Paste"})]}),e.jsx(a,{children:"Print..."}),e.jsx(C,{}),e.jsx(a,{children:"Exit"})]})}),i=y.bind({});i.play=async({canvasElement:d})=>{const r=p(d),n=async M=>{await c.keyboard(M),await l(100)},m=await r.findByRole("button");t(m).toBeInTheDocument();const u=async()=>{await l(500),await c.click(m),t(await r.findByRole("menuitem",{name:"New File"})).toBeInTheDocument()};await u(),await c.click(m.parentElement),t(r.queryByRole("menuitem",{name:"New File"})).not.toBeInTheDocument(),await u(),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),await n("{arrowdown}"),t(document.activeElement?.innerHTML).toBe("Exit"),await n("{arrowup}"),t(document.activeElement?.innerHTML).toBe("Print..."),await c.type(m.parentElement,"{Escape}"),t(r.queryByRole("menuitem",{name:"New File"})).not.toBeInTheDocument(),await u(),await n("{arrowdown}"),await n("{enter}"),t(s).toHaveBeenCalled(),t(o).toHaveBeenCalled(),s.mockClear(),o.mockClear(),await u(),await n("{arrowdown}"),await l(10),await n("{Tab}"),t(s).toHaveBeenCalled(),t(o).toHaveBeenCalled(),o.mockClear()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const F=["ReactMenuControlled"];export{i as ReactMenuControlled,F as __namedExportsOrder,S as default};
