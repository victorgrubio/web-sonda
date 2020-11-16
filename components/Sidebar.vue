<template>
    
        <div class="left side-menu">
            <div class="slimscroll-menu" id="remove-scroll">

                <div id="sidebar-menu">
                    <ul class="metismenu" id="side-menu">
                        <li class="menu-title">Menu</li>
                        <li>
                            <nuxt-link to="dashboard">
                                <i class="icon-accelerator"></i> <span> Dashboard </span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="import-export">
                                <i class="icon-rotate"></i> <span> Import / Export </span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="historic">
                                <i class="icon-calendar"></i> <span> Historic </span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="settings">
                                <i class="icon-sinth"></i> <span> Settings </span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="vod">
                                <i class="icon-video-cam"></i> <span> Journey </span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="account">
                                <i class="icon-profile"></i> <span> Account </span>
                            </nuxt-link>
                        </li>

                    </ul>

                </div>
                <div class="clearfix"></div>

            </div>

        </div>
    
</template>
<style>
.side-menu {
  top: 50px;
}
.nuxt-link-active{
    color: #ffffff !important;
    font-weight: bold;
    background-color: #2d3d91;
}
</style>