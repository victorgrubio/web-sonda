<template>
    <div>
        <table class="table table-borderless" v-if="videoDetails">
            <tbody>
                <tr>
                    <th scope="row">Vídeo Codec</th>
                    <td class="text-right">{{videoDetails.codec}}</td>
                </tr>
                <tr>
                    <th scope="row">Scan Type</th>
                    <td class="text-right">{{videoDetails.scan_type}}</td>
                </tr>
                <tr>
                    <th scope="row">Resolution</th>
                    <td class="text-right">{{videoDetails.width+' x '+videoDetails.height+' '+videoDetails.frame_rate}} </td>
                </tr>
                <tr>
                    <th scope="row">Pixel Format</th>
                    <td class="text-right">{{videoDetails.pix_format}}</td>
                </tr>
                <tr>
                    <th scope="row">Audio Codec</th>
                    <td class="text-right">{{videoDetails.audioCodec}}</td>
                </tr>
            </tbody>
        </table>

        <table class="table table-borderless mt-10">
            <tbody>
                <tr>
                    <th witdh="15%" scope="row">Bitrate</th>
                    <td>
                        <bitrateChart ref="bitrate"/>
                    </td>
                    <td witdh="15%" class="text-right">{{formatDecimals(videoDetails.bitrate)}} {{(typeof videoDetails.bitrate !== 'undefined') ? 'Kbps.': ''}}</td>
                </tr>
                <tr>
                    <th witdh="15%" scope="row">Temporal Complexity</th>
                    <td>
                        <temporalComplexChart ref="temporalComplex"/>
                    </td>
                    <td witdh="15%" class="text-right">{{formatDecimals(temporalComplexity)}}</td>
                </tr>
                <tr>
                    <th witdh="15%" scope="row">Spatial Complexity</th>
                    <td>
                        <spatialComplexChart ref="spatialComplex"/>
                    </td>
                    <td witdh="15%" class="text-right">{{formatDecimals(spatialComplexity)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import GOPChart from '~/components/GOPChart.vue'
import bitrateChart from '~/components/bitrateChart.vue'
import temporalComplexChart from '~/components/temporalComplexChart.vue'
import spatialComplexChart from '~/components/spatialComplexChart.vue'

export default {
    components: {
        GOPChart,
        bitrateChart,
        temporalComplexChart,
        spatialComplexChart
    },
    data() {
        return {
            videoDetails: '',
            colorSpace: 'RGB'
        }
    },
    computed:
    {
        temporalComplexity()
        {
            return (this.videoDetails !== '') ? (this.videoDetails.temp_inf_max + this.videoDetails.temp_inf_min) / 2 : 0;
        },
        spatialComplexity()
        {
            return (this.videoDetails !== '') ? (this.videoDetails.spat_inf_max + this.videoDetails.spat_inf_min) / 2 : 0;
        },
    },
    methods:
    {
        formatDecimals(value){
            return (typeof value !== 'undefined') ? parseFloat(value).toFixed(2) : '-';
        },
        setDetailsData(data, codec){
            this.videoDetails = data;
            this.videoDetails.audioCodec = codec;
            this.$refs.bitrate.addData('bitrate', data.bitrate);
            this.$refs.spatialComplex.addData('Space Complex.', this.spatialComplexity);
            this.$refs.temporalComplex.addData('Temp. Complex.', this.temporalComplexity);
        }
    }
}
</script>

<style scoped>
    .table td, .table th{
        padding: 0px;
    }
</style>