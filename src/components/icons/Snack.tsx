import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

const Snack = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox='0 0 20 20'>
      <path d='M16.6517 14.0915C16.8135 14.0915 16.9447 13.9603 16.9447 13.7985V4.82972C16.9447 4.60632 17.0226 4.38804 17.1641 4.21511L17.6927 3.56906C17.9196 3.29179 18.0445 2.94171 18.0445 2.58343V0.293002C18.0445 0.191283 17.9917 0.0968693 17.9051 0.043549C17.8185 -0.00981035 17.7104 -0.0143807 17.6197 0.0313615L16.201 0.746244L14.7823 0.0313615C14.6994 -0.0104354 14.6016 -0.0104354 14.5187 0.0313615L13.1002 0.746244L11.6817 0.0313615C11.5988 -0.0104354 11.501 -0.0104354 11.418 0.0313615L9.99959 0.746244L8.58123 0.0313615C8.4983 -0.0104354 8.40041 -0.0104354 8.31748 0.0313615L6.89932 0.746244L5.48096 0.0313615C5.39803 -0.0104354 5.30018 -0.0104354 5.21721 0.0313615L3.79881 0.746244L2.38045 0.0313615C2.28959 -0.0143807 2.18158 -0.00988848 2.09494 0.043549C2.0083 0.0968693 1.95557 0.191322 1.95557 0.293002V2.58347C1.95557 2.94175 2.08053 3.29183 2.3074 3.56909L2.836 4.21515C2.97744 4.38808 3.05537 4.60636 3.05537 4.82972V15.1703C3.05537 15.3937 2.97748 15.612 2.836 15.7849L2.3074 16.4309C2.08053 16.7082 1.95557 17.0583 1.95557 17.4165V19.707C1.95557 19.8087 2.0083 19.9031 2.09494 19.9565C2.14189 19.9854 2.19518 20 2.24857 20C2.29365 20 2.33885 19.9896 2.38041 19.9686L3.79877 19.2537L5.21717 19.9686C5.30014 20.0105 5.39799 20.0104 5.48092 19.9686L6.89928 19.2537L8.31744 19.9686C8.40041 20.0104 8.49822 20.0104 8.58119 19.9686L9.99955 19.2537L11.418 19.9686C11.501 20.0104 11.5988 20.0104 11.6817 19.9686L13.1002 19.2537L14.5186 19.9686C14.6015 20.0104 14.6994 20.0104 14.7823 19.9686L16.2009 19.2537L17.6196 19.9686C17.7104 20.0144 17.8184 20.0098 17.905 19.9564C17.9916 19.9031 18.0444 19.8087 18.0444 19.707V17.4165C18.0444 17.0582 17.9195 16.7082 17.6926 16.4309L17.164 15.7848C17.0225 15.6119 16.9446 15.3937 16.9446 15.1703C16.9446 15.0084 16.8134 14.8773 16.6516 14.8773C16.4897 14.8773 16.3586 15.0084 16.3586 15.1703C16.3586 15.5285 16.4835 15.8786 16.7104 16.1559L17.239 16.8019C17.3805 16.9748 17.4584 17.1931 17.4584 17.4165V17.5686H2.54158V17.4165C2.54158 17.1931 2.61947 16.9748 2.76096 16.8019L3.28955 16.1559C3.51643 15.8786 3.64139 15.5286 3.64139 15.1703V13.2066H16.3587V13.7984C16.3587 13.9603 16.4899 14.0915 16.6517 14.0915ZM17.4585 18.1548V19.2312L16.3328 18.664C16.2499 18.6222 16.1521 18.6222 16.0692 18.664L14.6505 19.3789L13.2321 18.664C13.1906 18.6431 13.1454 18.6326 13.1002 18.6326C13.055 18.6326 13.0098 18.6431 12.9684 18.664L11.5499 19.3789L10.1315 18.664C10.0485 18.6222 9.95069 18.6222 9.86772 18.664L8.44936 19.3789L7.03119 18.664C6.94822 18.6222 6.85041 18.6221 6.76744 18.664L5.34908 19.3789L3.93068 18.664C3.84775 18.6222 3.7499 18.6221 3.66693 18.664L2.54158 19.2312V18.1548H17.4585ZM2.54158 0.768783L3.66693 1.33597C3.74986 1.37777 3.84772 1.37777 3.93068 1.33597L5.34908 0.621088L6.76744 1.33597C6.85037 1.37777 6.94826 1.37777 7.03119 1.33597L8.4494 0.621088L9.86776 1.33597C9.95069 1.37777 10.0485 1.37777 10.1315 1.33597L11.5499 0.621088L12.9683 1.33597C13.0513 1.37777 13.1491 1.37777 13.232 1.33597L14.6505 0.621088L16.0691 1.33597C16.1521 1.37777 16.2499 1.37777 16.3328 1.33597L17.4584 0.768744V1.84519H2.54158V0.768783ZM3.64139 12.6206V7.3564H5.59557C5.7574 7.3564 5.88857 7.22522 5.88857 7.06339C5.88857 6.90155 5.7574 6.77038 5.59557 6.77038H3.64139V4.82968C3.64139 4.4714 3.51643 4.12136 3.28955 3.84405L2.76092 3.198C2.61947 3.02511 2.54154 2.80683 2.54154 2.58343V2.43132H17.4585V2.58343C17.4585 2.80683 17.3806 3.02511 17.2391 3.198L16.7105 3.84405C16.4836 4.1214 16.3587 4.47144 16.3587 4.82972V6.77042H6.95611C6.79432 6.77042 6.66311 6.90159 6.66311 7.06343C6.66311 7.22526 6.79428 7.35644 6.95611 7.35644H16.3587V12.6207H3.64139V12.6206Z' />
      <path d='M10.1711 8.96836C10.1704 8.96656 10.1697 8.96473 10.1689 8.96293C10.1318 8.8727 10.0447 8.81445 9.94715 8.81445C9.94707 8.81445 9.94696 8.81445 9.94684 8.81445C9.84914 8.81457 9.76211 8.87309 9.72516 8.96352C9.72453 8.96496 9.72399 8.96645 9.72344 8.96793L8.98605 10.904C8.94765 11.0048 8.99824 11.1177 9.09906 11.1561C9.19984 11.1944 9.31273 11.1439 9.35113 11.0431L9.48688 10.6867H10.402L10.5363 11.0425C10.5658 11.1207 10.6401 11.169 10.7191 11.1689C10.742 11.1689 10.7653 11.1649 10.788 11.1563C10.8889 11.1182 10.9399 11.0055 10.9018 10.9046L10.1711 8.96836ZM9.63563 10.296L9.94649 9.47981L10.2545 10.296H9.63563Z' />
      <path d='M8.31594 8.80811C8.20809 8.80917 8.12145 8.89745 8.1225 9.00534L8.13574 10.3716L7.1168 8.89616C7.06824 8.82581 6.97957 8.79522 6.89793 8.82065C6.81633 8.84608 6.76074 8.92163 6.76074 9.00713V10.973C6.76074 11.0809 6.8482 11.1683 6.95605 11.1683C7.06395 11.1683 7.15137 11.0809 7.15137 10.973V9.63374L8.12457 11.043C8.18399 11.1289 8.28231 11.1656 8.37504 11.1366C8.47012 11.1069 8.53152 11.0167 8.53152 10.9048L8.51313 9.00155C8.51211 8.8937 8.42543 8.80729 8.31594 8.80811Z' />
      <path d='M14.337 9.95117L15.1777 9.17836C15.2572 9.10535 15.2624 8.98176 15.1894 8.90234C15.1163 8.82289 14.9928 8.81773 14.9134 8.8907L14.1845 9.56066V9.00976C14.1845 8.90187 14.097 8.81445 13.9892 8.81445C13.8813 8.81445 13.7939 8.90191 13.7939 9.00976V10.9735C13.7939 11.0814 13.8813 11.1688 13.9892 11.1688C14.097 11.1688 14.1845 11.0814 14.1845 10.9735V10.3469L14.9796 11.1141C15.0176 11.1507 15.0664 11.1688 15.1152 11.1688C15.1664 11.1688 15.2175 11.1488 15.2558 11.1091C15.3307 11.0315 15.3285 10.9078 15.2509 10.8329L14.337 9.95117Z' />
      <path d='M12.8536 10.5708C12.835 10.5931 12.8148 10.6139 12.7937 10.6327C12.6852 10.7293 12.5476 10.7783 12.3847 10.7783C11.951 10.7783 11.5981 10.4254 11.5981 9.99169C11.5981 9.55797 11.951 9.20512 12.3847 9.20512C12.5423 9.20512 12.6944 9.25153 12.8243 9.3393C12.9136 9.39973 13.0351 9.37618 13.0955 9.2868C13.1559 9.19742 13.1324 9.07602 13.043 9.01563C12.8482 8.88402 12.6206 8.81445 12.3847 8.81445C11.7355 8.81445 11.2075 9.34254 11.2075 9.99169C11.2075 10.6408 11.7355 11.1689 12.3847 11.1689C12.6427 11.1689 12.874 11.0844 13.0536 10.9244C13.0888 10.8931 13.1222 10.8586 13.1529 10.822C13.2223 10.7393 13.2115 10.6161 13.1288 10.5468C13.0462 10.4774 12.923 10.4882 12.8536 10.5708Z' />
      <path d='M5.80719 9.82356C5.55786 9.73161 5.32633 9.6313 5.26415 9.60396C5.20872 9.56243 5.18196 9.49669 5.19215 9.4256C5.20536 9.33356 5.27692 9.25946 5.38352 9.22731C5.68805 9.13567 5.9652 9.35747 5.97024 9.36153C6.05281 9.43024 6.17543 9.41935 6.24465 9.337C6.31406 9.25446 6.3034 9.13122 6.22082 9.06181C6.20313 9.04692 5.78172 8.69919 5.27086 8.85325C5.01864 8.92923 4.84036 9.12724 4.80547 9.37005C4.77864 9.55692 4.84352 9.79778 5.00965 9.90321C5.20993 10.0303 5.45032 10.1083 5.67203 10.1901C5.87903 10.2664 5.98457 10.3843 5.96153 10.5133C5.93828 10.6434 5.78516 10.7779 5.56914 10.7779C5.36004 10.7779 5.15833 10.6931 5.02958 10.5509C4.95715 10.471 4.83364 10.4649 4.75368 10.5374C4.67376 10.6098 4.66766 10.7333 4.74008 10.8133C4.94165 11.0357 5.25161 11.1686 5.56914 11.1686C5.95239 11.1686 6.28641 10.9164 6.34613 10.582C6.39141 10.3282 6.27367 9.99564 5.80719 9.82356Z' />
    </SvgIcon>
  );
};

export default Snack;
