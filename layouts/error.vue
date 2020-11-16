<template>
    <div>
        <div class="error-bg"></div>
        <div class="home-btn d-none d-sm-block">
                <i class="fas fa-home h2"></i>
            </div>
        
        <div class="account-pages">
            
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-8">
                        <div class="card shadow-lg">
                            <div class="card-block">
                                <div class="text-center p-3">
                                    
                                    <h1 class="error-page mt-4"><span>404</span></h1>
                                    <h4 class="mb-4 mt-5">Sorry, page not found</h4>
                                    <nuxt-link to="dashboard"><i class="mdi mdi-home"></i> Back to Dashboard</nuxt-link>
                                </div>
            
                            </div>
                        </div>
                                            
                    </div>
                </div>
                <!-- end row -->
            </div>
        </div>
    </div>
</template>