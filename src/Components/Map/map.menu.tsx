import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { ChannelType } from "../../Types/Channel.types";
import React, { useState } from 'react';
import { makeStyles, createStyles} from '@mui/styles';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme: Theme) => createStyles({
    flex: {
        display: 'flex',
        fontSize: '20px',
        paddingTop: '3px',
        fontFamily: 'BriemScript',
    },
    paper: {
        border: '2px dashed black',
        padding: '5px',
        backgroundColor: '#F8F3E3',
        borderRadius: '16px',
        maxHeight:100,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'BriemScript',
    },
    button: {
        display: 'flex',
        padding: '3px',
        cursor: 'pointer',
    },
    content: {
        backgroundColor: '#F8F3E3',
        padding: '10px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'BriemScript',
        border: '2px dashed black',
    },
    menuItem: {
        padding: '10px',
        cursor: 'pointer',
        textTransform: 'capitalize',
    },
    hr: {
        border: '3px solid white',
        fontFamily: 'BriemScript',
    },
    mx3:{
        margin:3,
    }
}));


interface MenuProps {
    communities: ChannelType[],
    selectCommunity: (community: ChannelType) => void


}
export const Menu: React.FC<MenuProps> = ({ communities, selectCommunity }: MenuProps) => {
    const classes = useStyles();
    const [showCommunities, setShowCommunities] = useState(false);
    const [showThemes, setShowThemes] = useState(false);

    const returnTitle = (community:ChannelType) => {
        // Replace with your logic to get the community title
        return community.name;
    };

    
    return (
        <div className={classes.flex}>
            <div className={classes.paper}>
                <div>
                    <Button
                        onClick={() => {
                            setShowCommunities(!showCommunities);
                            setShowThemes(false);
                        }}
                        className={classes.button}
                    >
                        <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} sx={{color:"black"}}>
                            <Typography className={classes.menuItem} sx={{fontFamily:'BriemScript'}} >Communities</Typography>
                            <ArrowIcon />
                        </Stack>
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setShowThemes(!showThemes);
                            setShowCommunities(false);
                        }}
                        className={classes.button}
                    >
                        <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} sx={{color:"black"}}>
                            <Typography className={classes.menuItem} sx={{fontFamily:'BriemScript'}}>Themes</Typography>
                            <ArrowIcon />
                        </Stack>
                    </Button>
                </div>
                <div>

                </div>
            </div>
            <div className={classes.mx3}>
                {showCommunities && (
                    <Paper className={classes.content}>
                        {communities.map((community, index) => (
                            <div
                                key={index}
                                className={classes.menuItem}
                                onClick={() => selectCommunity(community)}
                            >
                                <Typography  style={{ textTransform: 'capitalize', fontFamily:'BriemScript' }}>
                                    {returnTitle(community)}
                                </Typography>
                            </div>
                        ))}
                    </Paper>
                )}
                {showThemes && (
                    <Paper className={classes.content}>
                        <Typography className={classes.menuItem}>Relations with villagers</Typography>
                        <hr className={classes.hr} />
                        <Typography className={classes.menuItem}>Relations with state</Typography>
                        <hr className={classes.hr} />
                        <Typography className={classes.menuItem}>Relations with communities</Typography>
                        <hr className={classes.hr} />
                        <Typography className={classes.menuItem}>Relations with ration shop owners</Typography>
                    </Paper>
                )}
            </div>
        </div>
    );
}