import * as THREE from "three"
import {computed} from "vue";

export default (initialOffset: THREE.Vector3, camera: globalThis.ComputedRef<THREE.Camera | undefined>) => {
    const currentPosition = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3();
    const { page } = useContent();

    function calculateOffset(targetPosition: THREE.Vector3, offset: THREE.Vector3) {
        const idealOffset = offset.clone();
        idealOffset.add(targetPosition);
        return idealOffset;
    }

    const currentPart = computed(() => {
        return page.value && page.value.position ? new THREE.Vector3(
            page.value.position[0],
            page.value.position[1],
            page.value.position[2]) : new THREE.Vector3()
    })

    const currentPartOffset = computed(() => {
      return page.value && page.value.offset ? new THREE.Vector3(
          page.value.offset[0],
          page.value.offset[1],
          page.value.offset[2]) : initialOffset
    })

    const { onLoop } = useRenderLoop();
    onLoop(({ delta }) => {
        let idealOffset = calculateOffset(currentPart.value, currentPartOffset.value);

        currentPosition.lerp(idealOffset, delta);
        currentLookAt.lerp(currentPart.value, delta);

        if (!camera.value) return;

        camera.value.position.copy(currentPosition);
        camera.value.lookAt(currentLookAt);
    });
}