<template>
    <div class="header">
        <div class="header-left">
            <div class="logo">
                <img src="../../assets/img/logo1.png" alt="">
            </div>
            <!-- <div class="admin-name">米京快充后端管理后台</div> -->
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/portrait.svg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        <el-dropdown-item command="setpassword">修改密码</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import { removeStore } from "../../assets/js/utils.js"
    import bus from '../common/bus';
    export default {
        data() {
            return {
                // collapse: false,
                fullscreen: false,
                name: 'admin',
                message: 2,
            };
        },
        computed: {
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {
                    removeStore('token')
                    this.$router.push('/login');
                } else if (command == 'setpassword') {
                    this.$router.push('/SetPassword')
                }
            },
            // 侧边栏折叠
            // collapseChage() {
            //     this.collapse = !this.collapse;
            //     bus.$emit('collapse', this.collapse);
            // },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted() {
            // if (document.body.clientWidth < 1500) {
            //     this.collapseChage();
            // }
        }
    };
</script>
<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        background: #FFFFFF;
        box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
        width: 100%;
        height: 60px;
        font-size: 20px;

    }

    .header-left {
        display: flex;

    }

    .admin-name {
        line-height: 60px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
    }



    .header .logo {

        display: flex;
        align-items: center;
        justify-content: center;
        width: 444px;
        height: 60px;


    }

    .header img {
        width: 444px;
        height: 50px;

    }

    .header-right {

        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 60px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #000;
    }

    .btn-bell .el-icon-bell {
        color: #000;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #000;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>