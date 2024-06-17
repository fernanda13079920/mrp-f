text-decoration: none;
padding: calc(${v.smSpacing} - 2px) 0;
color: ${(props) => props.theme.text};
height: 40px;
&.active {
  color: ${(props) => props.theme.bg4};
}
span {
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
}
}
}

.Themecontent {
display: flex;
align-items: center;
justify-content: space-between;
.titletheme {
display: block;
padding: 10px;
font-weight: 700;
opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
transition: all 0.3s;
white-space: nowrap;
overflow: hidden;
}
.Togglecontent {
margin: ${({ isOpen }) => (isOpen ? `auto 40px` : `auto 15px`)};
width: 36px;
height: 20px;
border-radius: 10px;
transition: all 0.3s;
position: relative;
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
    &:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  input:checked + .slider {
    background-color: #2196f3;
  }
  input:checked + .slider:before {
    transform: translateX(20px);
  }
}
}
}
`;

const Divider = styled.div`
height: 1px;
width: 100%;
background: ${(props) => props.theme.bg3};
margin: ${v.lgSpacing} 0;
`;

export default Sidebar;
