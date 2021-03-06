import React, { useEffect, useState } from 'react';
import { withStyles, Fab, Button } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { PhotoLibrary } from '@material-ui/icons';

const styles = (theme) => ({
    root: {
        background: 'transparent',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px'
    },
    cameraActions: {
        display: 'flex',
        width: '100%',
        height: '20%',
        background: '#333',
        justifyContent: 'center',

    },
    flexContainer: {
        justifyContent: 'center'
    },
    captureFab: {
        backgroundColor: '#FFF',
        [theme.breakpoints.down('md')]: {
            marginRight: '-2rem',
        },
    },
    videoContainer: {
        width: '100%',
        height: '70%',
        background: 'transparent'
    },
    camera: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: 'scale(-1, 1)'
    },
    cameraTabsContainer: {
        width: '70%',
        display: 'flex',
        flexDirection: 'column'
    },
    cameraTabIndicatorOvr: {
        height: '0.5rem',
        top: 0,
        backgroundColor: '#FFF'
    },
    toggleFab: {
        color: '#000',
        backgroundColor: 'yellow',
    },
    galleryPickerContainer: {
        width: '10%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    galleryPickerIcon: {
        width: '2rem',
        height: '2rem',
        cursor: 'pointer'
    }
});

const deviceSet = new Set();
const deviceIds = [];
const cameraTabLabels = [
    'Insurance',
    'Bill',
    'EOB'
];

if (navigator.mediaDevices) {

    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                let capabilities = device.getCapabilities();
                if ((device.kind == 'videoinput') && (capabilities.facingMode && capabilities.facingMode.length > 0)) {

                    if (!deviceSet.has(device.deviceId)) {
                        deviceSet.add(device.deviceId);
                        deviceIds.push(device.deviceId);
                    }
                }
            });
        })
        .catch(function (err) {

        });
}

let startCamera = (idx) => {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            // facingMode: { exact: window.mobileAndTabletcheck() ? 'environment' : 'user' },
            deviceId: deviceIds[idx]
        },
        audio: false
    }).then(stream => {
        document.getElementById('player').srcObject = stream;
    }).catch((error) => {

    });
};

let stopCamera = () => {
    const videoEl = document.getElementById('player');

    if (videoEl) {
        videoEl.pause();
        const stream = videoEl.srcObject;

        if (!stream) {
            return;
        }

        stream.getTracks()[0].stop();
    }
}

let capture = (props) => {
    const videoEl = document.getElementById('player');
    const stream = videoEl.srcObject;
    const height = stream.getTracks()[0].getSettings().height;
    const width = stream.getTracks()[0].getSettings().width;

    let canvas = document.createElement('canvas');
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    let context = canvas.getContext('2d');
    context.scale(-1, 1);

    context.drawImage(videoEl, 0, 0, canvas.width * -1, canvas.height);
    const cameraEvent = Object.create({
        width,
        height,
        captureDataURL: context.canvas.toDataURL()
    });


    props.onCapture(cameraEvent);

    context = null;
    canvas = null;
    stopCamera();
};

const handleFiles = (e, onGalleryPickerClick) => {
    const files = e.nativeEvent.target.files;
    onGalleryPickerClick(files);

    /**
     * @todo May be implement no. of files picked
     */
    //updateFiles(`${files.length} Selected`);
};

const handleClick = (e) => {
    const inputEl = document.getElementById('real-input');

    if (inputEl) {
        inputEl.click();
    }
}

const Camera = (props) => {
    const {
        classes,
        onGalleryPickerClick
    } = props;

    useEffect(() => {
        stopCamera();
        startCamera(idx);

        return () => {
            stopCamera();
        }
    }, []);

    const [idx, inc] = useState(0);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <div className={classes.videoContainer}>
                <video
                    id="player"
                    autoPlay
                    className={classes.camera}
                />
            </div>
            <div className={classes.cameraActions}>
                <div className={classes.cameraTabsContainer}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        classes={{
                            flexContainer: classes.flexContainer
                        }}
                        TabIndicatorProps={{
                            className: classes.cameraTabIndicatorOvr
                        }}
                    >
                        {
                            cameraTabLabels.map((label, indexKey) => {
                                return (
                                    <Tab
                                        label={label}
                                        key={indexKey}
                                    />
                                )
                            })
                        }
                    </Tabs>
                    <Fab
                        className={classes.captureFab}
                        onClick={(e) => capture(props)}
                    >
                    </Fab>
                </div>
                {deviceIds.length > 1 && (
                    <Fab
                        className={classes.toggleFab}
                        onClick={() => { inc((idx + 1) % deviceIds.length) }}
                    >
                        TC
                    </Fab>
                )}
                <div className={classes.galleryPickerContainer}>
                    <input
                        type={"file"}
                        id={"real-input"}
                        accept={"application/pdf, image/*"}
                        onChange={(e) => handleFiles(e, onGalleryPickerClick)}
                        style={{
                            display: 'none'
                        }}
                    />
                    <PhotoLibrary
                        className={classes.galleryPickerIcon}
                        onClick={handleClick}
                    />
                </div>
            </div>
        </div>
    );

}

export default withStyles(styles, { withTheme: true })(Camera);