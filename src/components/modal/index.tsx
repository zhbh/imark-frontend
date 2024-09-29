import React, { PropsWithChildren, useState } from 'react';
import { Button, Modal } from 'antd';

const PopUpModal: React.FC<
    PropsWithChildren & {
        title?: string,
        open: boolean,
        callback?: Function
    }
> = ({ children, title, open, callback }) => {

    return (
        <>
            <Modal
                title={title}
                centered
                open={open}
                onOk={() => {
                    callback && callback(true);
                    Modal.destroyAll();
                }}
                onCancel={() => {
                    callback && callback(false);
                    Modal.destroyAll();
                }}
                width={800}
            >
                {children}
            </Modal>
        </>
    );
};

export default PopUpModal;