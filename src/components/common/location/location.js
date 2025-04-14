import base from '@/api/base';
import { stockApi } from "@/api/index.js"
import { mapConfig } from "@/utils/config/config.js";
export default {
    props: {
        visible: { type: Boolean, default: true },
        locationEntity: { type: Object, default: () => { return { title: '', address: '', lat: '', lng: '' } } }
    },
    data() {
        return {
            keywords: '',                           // 地址
            lat: '',                                // 纬度
            lng: ''                                 // 经度
        }
    },
    computed: {
        dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } },
    },
    watch: {
        visible(newVal, oldVal) {
            this.$nextTick(() => {
                if (newVal && this.$app.isNull(this.map)) {

                    this.map = new TMap.Map("map", { pitch: 45, zoom: 18, viewMode: '3D', mapStyleId: 'style1' });
                    this.map.on("click", evt => {
                        this.lat = evt.latLng.getLat().toFixed(6);
                        this.lng = evt.latLng.getLng().toFixed(6);
                        let position = new TMap.LatLng(this.lat, this.lng);
                        this.setMarker(position, false);
                    })
                    this.setAddressLatLng();
                } else if (newVal) {
                    this.setAddressLatLng();
                }
            });
        }
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.map = new TMap.Map("map", { pitch: 45, zoom: 18, viewMode: '3D', mapStyleId: 'style1' });
        //     let that = this;
        //     this.map.on("click", function (evt) {
        //         that.lat = evt.latLng.getLat().toFixed(6);
        //         that.lng = evt.latLng.getLng().toFixed(6);
        //         let position = new TMap.LatLng(that.lat, that.lng);
        //         that.setMarker(position, false);
        //     })
        // })
    },
    methods: {
        handleSubmit() {
            if (this.$app.isNull(this.lat) || this.$app.isNull(this.lng)) return this.$message({ message: '还未选择定位点，请点击地图或输入地址搜索定位', type: 'warning' });
            this.dialogVisible = false;
            this.$emit('callback', { lat: this.lat, lng: this.lng });
        },
        setAddressLatLng() {                                  // 设置传入的地址和经纬度坐标
            this.keywords = this.locationEntity.address;
            if (!this.$app.isNull(this.locationEntity.lat) && !this.$app.isNull(this.locationEntity.lng)) {
                let position = new TMap.LatLng(this.locationEntity.lat, this.locationEntity.lng);
                this.lat = this.locationEntity.lat;
                this.lng = this.locationEntity.lng;
                this.setMarker(position, false);
            }
            else if (!this.$app.isNull(this.locationEntity.address)) {
                this.handleMarker()
            }
        },
        setMarker(position, bool = true) {                    // 设置markeer地点坐标
            if (!this.$app.isNull(this.marker)) this.marker.setMap(null);
            if (bool) this.map.setCenter(position);
            this.marker = new TMap.MultiMarker({
                id: "marker-layer", map: this.map,
                styles: { marker: new TMap.MarkerStyle({ width: 20, height: 32, src: base.frontImgBase + '/images/system/mark.png' }) },
                geometries: [{ id: "markerCode", styleId: "marker", position: position }]
            });
        },
        handleMarker() {                                      // 根据地址设置Marker地点坐标
            if (this.$app.isNull(this.keywords)) return;
            stockApi.getGeoCoder({ address: this.keywords }).then(res => {
                if (res.status === 0) {
                    let position = new TMap.LatLng(res.result.location.lat, res.result.location.lng);
                    this.setMarker(position);
                } else {
                    this.$message({ message: res.message, type: 'warning' });
                }
            });
        },

    }
}
