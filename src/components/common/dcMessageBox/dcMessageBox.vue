<template>
    <div class="dcMessageBox" @click.stop="" v-if="visible">
        <div class="masking" @click="onCloseHandle" :style="{ 'z-index': zIndex }"></div>
        <div class="bell" :style="{ 'z-index': zIndex + 2 }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon">
                <path fill-rule="evenodd"
                    d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
                    clip-rule="evenodd" />
            </svg>
        </div>
        <div class="content-bg" :style="{ 'z-index': zIndex + 1 }">
            <div class="content">
                <div class="title">{{ title }}</div>
                <div class="slot">
                    <slot></slot>
                </div>
                <div class="btn" :class="{ shake: disabled }" @click="onConfirmHandle">{{ btnTxt }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "DcMessage",
    props: {
        title: {
            type: String,
            default: "温馨提示"
        },
        btnTxt: {
            type: String,
            default: "确定"
        },
        zIndex: {
            type: Number,
            default: 2055
        },
        closeable: {
            type: Boolean,
            default: true
        },
        visible:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            disabled: false,
        }
    },
    mounted() {
        this.disabled = false
    },
    methods: {
        onConfirmHandle() {
            this.$emit("confirm")
        },
        onCloseHandle() {
            if (!this.closeable) {
                this.disabled = true
                setTimeout(() => {
                    this.disabled = false
                }, 820);
            }else{
                this.$emit("close")
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.dcMessageBox {
    .masking {
        background-color: rgba(#000, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .bell {
        position: fixed;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -16px);
        border: 2px solid #fff8f4;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(to bottom, #febe69 15%, #f47f6f);
        box-shadow: 0px 0px 1px 1px darken($color: #ffece1, $amount: 2);

        .icon {
            width: 30px;
            height: 30px;
            color: #ffe9ce;
        }

        &::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 4px;
            background-color: #ffe9ce;
            transform: rotate(30deg);
            top: 11px;
            right: 19px;
            border-radius: 1px;
        }

        &::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 5px;
            background-color: #ffe9ce;
            transform: rotate(45deg);
            top: 12px;
            right: 16px;
            border-radius: 1px;
        }
    }

    .content-bg {
        position: fixed;
        width: 310px;
        height: 190px;
        left: 50%;
        top: 40%;
        transform: translateX(-50%);
        border-radius: 14px;
        background-image: linear-gradient(to bottom, #ffece1 15%, white);
        overflow: hidden;

        &::before {
            position: absolute;
            content: "";
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background-image: linear-gradient(to bottom, #ffece1 15%, rgba(white, 0.4));
            left: 14px;
            top: -30px;
        }

        &::after {
            position: absolute;
            content: "";
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-image: linear-gradient(to bottom, #ffece1 15%, rgba(white, 0.4));
            right: -15px;
            top: -15px;
        }

        .content {
            width: 100%;
            height: calc(100% - 40px);
            margin-top: 40px;
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            &::after {
                position: absolute;
                content: "";
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-image: linear-gradient(to bottom, #ffece1 15%, rgba(white, 0.4));
                right: 25px;
                top: -25px;
            }

            .title {
                font-weight: bold;
                letter-spacing: 1px;
                font-size: 15px;
                height: 20px;
            }

            .slot {
                height: calc(100% - 62px);
                width: 100%;
                box-sizing: border-box;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: center
            }

            .btn {
                background-color: #435aea;
                color: white;
                height: 32px;
                min-width: 150px;
                border-radius: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            .shake {
                animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                transform: translate3d(0, 0, 0);
            }

            @keyframes shake {
                10%,
                90% {
                    transform: translate3d(-1px, 0, 0);
                }

                20%,
                80% {
                    transform: translate3d(2px, 0, 0);
                }

                30%,
                50%,
                70% {
                    transform: translate3d(-4px, 0, 0);
                }

                40%,
                60% {
                    transform: translate3d(4px, 0, 0);
                }
            }
        }
    }
}
</style>