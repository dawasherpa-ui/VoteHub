import { Box,List,ListItem,Tab} from '@mui/material';
import React,{ useState} from 'react'
import {  TabContext, TabList, TabPanel } from '@mui/lab';
import Banner from './Banner';

// Rest of your code...
export default function TabBanner({following,followers,tab,onClose}) {
    // console.log(followers)
    // console.log(following)
    const [value, setValue] = useState(`${tab}`);
    const handleChange = (event,newValue) => {
        setValue(newValue);
      };
  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Followers" value="1" />
            <Tab label="Followings" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{padding:"0px"}}>
            <List>
                {followers?.map((e,i)=>
                <ListItem key={i}>
                    <Banner info={e} event={onClose}/>
                </ListItem>
                )}
            </List>
        </TabPanel>
        <TabPanel value="2" sx={{padding:"0px"}}>
        <List sx={{display:"flex",flexDirection:"column"}}>
                {following?.map((e,i)=>
                <ListItem key={i}>
                    <Banner info={e} event={onClose}/>
                </ListItem>
                )}
            </List>
        </TabPanel>
      </TabContext>
    </Box>
    </div>
  )
}
