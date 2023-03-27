import React from 'react';
import styled from 'styled-components';

const PopupDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(118, 116, 116, 0.49);
    display: none;
`;

function PopUpContainer({ id, children }) {
    return (
        <PopupDiv className="form-popup" id={id}>{children}</PopupDiv>
    )
}

export default PopUpContainer